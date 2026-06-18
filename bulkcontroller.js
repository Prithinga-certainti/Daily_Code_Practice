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


const getJobStatus = async (req, res, next) => {
  try {
    const job = await BulkUploadJob.findByJobId(req.params.jobId);
    if (!job) return error(res, 'Job not found', 404);
    return success(res, job, 'Job fetched successfully');
  } catch (err) {
    next(err);
  }
};
const getAllJobs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const jobs = await BulkUploadJob.findAll(limit, offset);
    return success(res, jobs, 'Jobs fetched successfully');
  } catch (err) {
    next(err);
  }
};
const deleteJob = async (req, res, next) => {
  try {
    const job = await BulkUploadJob.findByJobId(req.params.jobId);
    if (!job) return error(res, 'Job not found', 404);
    await BulkUploadJob.deleteJob(req.params.jobId);
    return success(res, 'Job deleted successfully');
  } catch (err) {
    next(err);
  }
};
const getJobItems = async (req, res, next) => {
  try {
    const job = await BulkUploadJob.findByJobId(req.params.jobId);
    if (!job) return error(res, 'Job not found', 404);
    const pool = require('../config/database');
    const { rows } = await pool.query(
      `SELECT * FROM menu_items WHERE user_id = $1 ORDER BY display_order ASC`,
      [job.user_id]
    );
    return success(res, rows, 'Menu items fetched successfully');
  } catch (err) {
    next(err);
  }
};

const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.findByUserId(req.user.id);
    return success(res, restaurants, 'Restaurants fetched successfully');
  } catch (err) {
    next(err);
};
}
const getMenuItem = async (req, res, next) => {
  try{
    const pool=require('../config/database');
    const {restaurant_id, item_id}=req.params;
    const userId=req.user.id;
    const totalParamas=[userId];
    let totalQuery='SELECT COUNT(*) AS total ,COUNT(DISTINCT item_id) AS unique FROM menu_items WHERE user_id = $1';
    if(restaurant_id){
      totalQuery+=' AND restaurant_id = $2';
      totalParamas.push(restaurant_id);
    }
    const {rows:totalRows}=await pool.query(totalQuery,totalParamas);
    const total=parseInt(totalRows[0].total,10);
    const totalCategory=parseInt(totalRows[0].category);
    let query='SELECT * FROM menu_items WHERE user_id = $1';
    const params=[userId];
    if(restaurant_id){
      query+=' AND restaurant_id = $2';
      params.push(restaurant_id);
    }
    if(item_id){
      query+=' AND item_id = $3';
      params.push(item_id);
    }
    query+=' ORDER BY display_order ASC';
    const {rows}=await pool.query(query,params);
    return success(res,{total,rows},'Menu items fetched');
  }catch(err){
      next(err);

  }
}
const downloadTemplate = async (req, res, next) => {
  try{
    const filePath=await templateService.generateTemplate();
    res.download(filePath, 'menu_template.csv', (err) => {
      if (err) {
        logger.error('Error sending template file:', err);
        return next(err);
      }
      templateService.deleteTemplate(filePath);
    });
  }catch(err){
      next(err);
  }
}
module.exports={uploadFile, getJobStatus, getAllJobs, deleteJob, getJobItems, getRestaurants, getMenuItem, downloadTemplate};