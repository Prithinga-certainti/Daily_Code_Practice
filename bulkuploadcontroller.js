const BulkUploadJob = require('../models/BulkUploadJob');
const csvParserService = require('../services/csvParserService');
const importService = require('../services/importService');
const templateService = require('../services/templateService');
const { success, error } = require('../utils/responseFormatter');
const { deleteFile } = require('../utils/fileHelper');
const logger = require('../utils/logger');
const uploadFile = async (req, res, next) => {
  let filePath = null;
  try {
    filePath = req.file.path;
    const userId = req.user.id;
    const fileName = req.file.originalname;
    const { rows, totalRows } = await csvParserService.parseFile(filePath);
    const job = await BulkUploadJob.createJob(userId, fileName, totalRows);
    await BulkUploadJob.startProcessingJob(job.job_id);
    const { validRows, invalidRows, errors } = await csvParserService.validateRows(rows);
    if (validRows.length === 0) {
      await BulkUploadJob.updateJobStatus(job.job_id, 'failed', 0, invalidRows.length);
      deleteFile(filePath);
      return error(res, 'No valid rows found', 400, errors);
    }
    const { importedRows, skippedRows } = await importService.importRows(validRows, userId);
    if (skippedRows > 0 && importedRows > 0) {
      await BulkUploadJob.partialJob(job.job_id, importedRows, skippedRows, validRows.length, invalidRows.length);
    } else if (importedRows === 0) {
      await BulkUploadJob.failJob(job.job_id, validRows.length, invalidRows.length);
    } else {
      await BulkUploadJob.completeJob(job.job_id, importedRows, skippedRows);
    }
    deleteFile(filePath);
    return success(res, 'File uploaded and processed successfully', {
      jobId: job.job_id,
      totalRows,
      validRows: validRows.length,
      invalidRows: invalidRows.length,
      importedRows,
      skippedRows,
      errors,
    });
  } catch (err) {
    if (filePath) deleteFile(filePath);
    next(err);
  }
};
const getJobStatus = async (req, res, next) => {
  try {
    const job = await BulkUploadJob.findByJobId(req.params.jobId);
    if (!job) return error(res, 'Job not found', 404);
    return success(res, 'Job fetched successfully', job);
  } catch (err) {
    next(err);
  }
};
const getAllJobs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const jobs = await BulkUploadJob.findAll(limit, offset);
    return success(res, 'Jobs fetched successfully', jobs);
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
const downloadTemplate = async (req, res, next) => {
  try {
    const filePath = await templateService.generateTemplate();
    res.download(filePath, 'bulk_upload_template.csv', (err) => {
      if (err) next(err);
      deleteFile(filePath);
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { uploadFile, getJobStatus, getAllJobs, deleteJob, downloadTemplate };
