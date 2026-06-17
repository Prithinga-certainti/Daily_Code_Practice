const BulkUploadJob=require('../models/BulkUploadJob');
const Restaurant=require('../models/Restaurant');
const csvParserService=require('../services/csvParserService');
const importService=require('../services/importService');
const templateService=require('../services/templateService');
const { success, error }=require('../utils/responseFormatter');
const { deleteFile }=require('../utils/fileHelper');
const logger=require('../utils/logger');

const uploadFile=async (req,res,next) => {
  let filePath=null;
  try {
    filePath=req.file.path;
    const userId=req.user.id;
    const fileName=req.file.originalname;
    const restaurantId=req.body.restaurant_id;
    if (!restaurantId) {
      deleteFile(filePath);
      return error(res, 'Please select a restaurant before uploading', 400);
    }
    const restaurant=await Restaurant.findByRestaurantId(restaurantId);
    if (!restaurant) {
      deleteFile(filePath);
      return error(res, 'Restaurant not found', 404);
    }
    const { rows, totalRows }=await csvParserService.parseFile(filePath);
    const job=await BulkUploadJob.createJob(userId, fileName, totalRows);
    await BulkUploadJob.startProcessingJob(job.job_id);
    const { validRows, invalidRows, errors }=await csvParserService.validateRows(rows);
    if (validRows.length === 0) {
      await BulkUploadJob.updateJobStatus(job.job_id, 'failed', 0, invalidRows.length);
      deleteFile(filePath);
      return error(res, 'No valid rows found', 400, errors);
    }
    const { importedRows, skippedRows } = await importService.importRows(validRows, userId, restaurantId);
    if (importedRows === 0) {
      await BulkUploadJob.failJob(job.job_id, validRows.length, invalidRows.length, errors);
    } else if (invalidRows.length > 0 || skippedRows > 0) {
      await BulkUploadJob.partialJob(job.job_id, importedRows, skippedRows, validRows.length, invalidRows.length, errors);
    } else {
      await BulkUploadJob.completeJob(job.job_id, importedRows, skippedRows, validRows.length, invalidRows.length, errors);
    }
    deleteFile(filePath);
    return success(res, {
      jobId: job.job_id,
      totalRows,
      validRows: validRows.length,
      invalidRows: invalidRows.length,
      importedRows,
      skippedRows,
      errors,
    }, 'File uploaded and processed successfully');
  } catch (err) {
    if (filePath) deleteFile(filePath);
    next(err);
  }
};