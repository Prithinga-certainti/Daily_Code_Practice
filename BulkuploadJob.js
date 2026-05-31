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