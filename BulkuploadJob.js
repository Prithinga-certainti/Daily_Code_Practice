const pool = require('./config/database');
const {v4:uuidV4}=require ('uuid');
const upload_constant=require('./uploadconstant');
//create job
const createJob=async(userid,filename,total_row) =>{
    const jobid=uuidV4();
    const query = `
    INSERT INTO bulk_upload_jobs 
    (job_id, user_id, file_name, total_rows, valid_rows, invalid_rows, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, 0, 0, $5, NOW(), NOW())
    RETURNING *`;
    const {rows}=await pool.query(query,
    [jobid,
        userid,
        filename,
        total_row,
        upload_constant.JOB_STATUS.PENDING
    ]
    );
    return rows[0];
}
//update job
const startprocessingjob=async(jobId)=>{
    const query = `
    UPDATE bulk_upload_jobs
    SET status = $1,
        updated_at = NOW()
    WHERE job_id = $2
    RETURNING *`;
    const {row}=await pool.query(query,[
        upload_constant.JOB_STATUS.PROCESSING,
        jobId
    ]);
    return row[0];
}
//update job status with vaild and invalid row count 
const updateJobStatus=async(jobId,validRowCount,invalidRowCount,status)=>{
    const allowedStatus=Object.values(upload_constant.JOB_STATUS);
    if(!allowedStatus.includes(status)){
        throw new Error(`Invalid status: ${status}, Allowed status are ${allowedStatus.join(',')}`);
    }
    const query=`
    UPDATE bulk_upload_jobs
    SET valid_rows = $1,
    invalid_rows=$2,
    status=$3,
    updated_at=NOW()
    WHERE job_id=$4
    Returning *`;
    const {rows}=await pool.query(query ,[validRowCount, invalidRowCount, status, jobId]);
    return rows[0];
}
const completeJob=async(jobId,importedRows,skippedRows)=>{
    const query=`
    update bulk_upload_jobs
    set status=$1,
    imported_rows=$2,
    skipped_rows=$3,
    completed_at=NOW(),
    updated_at=NOW()
    where job_id=$4
    returning *`;
    const {rows}=await pool.query(query,[
        upload_constant.JOB_STATUS.COMPLETED,
        importedRows,
        skippedRows,
        jobId
    ]);
    return rows[0];
}
const failJob=async(jobId,validRows=0,invalidRows=0)=>{
    const query=`
    update bulk_upload_jobs
    set status=$1,
    valid_rows=$2,
    invalid_rows=$3,
    completed_at=NOW(),
    updated_at=NOW()
    where job_id=$4
    returning *`;
    const {rows}=await pool.query(query,[
        upload_constant.JOB_STATUS.FAILED,
        validRows,
        invalidRows,
        jobId
    ]);
    return rows[0];
}
const partialJob=async(jobId,importedRows,skippedRows,validRows,invalidRows)=>{
    const query=`
    update bulk_upload_jobs
    set status=$1,
    imported_rows=$2,
    skipped_rows=$3,
    valid_rows=$4,
    invalid_rows=$5,
    completed_at=NOW(),
    updated_at=NOW()
    where job_id=$6
    returning *`;
    const {rows}=await pool.query(query,[
        upload_constant.JOB_STATUS.PARTIAL,
        importedRows,
        skippedRows,
        validRows,
        invalidRows,
        jobId
    ]);
    return rows[0];
}
const getJobById=async(jobId)=>{
    const query=`
    select * from bulk_upload_jobs where job_id=$1`;
    const{rows}=await pool.query(query,[jobId]);
    return rows[0];
}
const findAll=async(limit=25,offset=0)=>{
    const query=`
    select * from bulk_upload_jobs order by created_at desc limit $1 offset $2`;
    const {rows}=await pool.query(query,[limit,offset]);
    return rows;
}
const deleteJob=async(jobId)=>{
    const query=`
    delete from bulk_upload_jobs where job_id=$1 returning *`;
    const {rows}=await pool.query(query,[jobId]);
    return rows[0]; 
}
module.exports={
    createJob,
    startprocessingjob,
    updateJobStatus,
    completeJob,
    failJob,
    partialJob,
    getJobById,
    findAll,
    deleteJob
}