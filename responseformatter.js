const success =(res, data=null,message=success, statusCode=200)=>{
    return res.status(statusCode).json({
        success:true,
        message,
        data,
        error:null,
    });
}
const error=(res,message="something went wrong",statusCode=500,errors=null)=>{
    return res.status(statusCode).json({
        success:false,
        message,
        data:null,
        errors
    });
}
const notFound=(res,message="resource not found",statusCode=404)=>{
    return res.status(statusCode).json({
        success:false,
        message,
        data:null,
        errors:null
    });
}
const validationError=(res,message="validation error",statusCode=422,errors=[])=>{
    return res.status(statusCode).json({
        success:false,
        message,
        data:null,
        errors
    });
}
const uploadedsuccess=(res,data={})=>{
    return res.status(200).json({
        success:true,
        message:"file uploaded successfully",
        data:{
            jobId:data.jobId ?? null,
            totalRows:data.totalRows ?? 0,
            validRows:data.validRows ?? 0,
            invalidRows:data.invalidRows ?? 0,
            errors:data.errors ?? [],
            preview:data.preview ?? []
        },
        errors:null
    });
}
const importSuccess=(res,data={})=>{
    return res.status(200).json({
        success:true,
        message:"data imported successfully",
        data:{
            jobId:data.jobId ?? null,
            totalRows:data.totalRows ?? 0,
            importedRows:data.importedRows ?? 0,
            skippedRows:data.skippedRows ?? 0,
            totalErrors:data.totalErrors ?? 0,
        },
        error:null
    });
}
const paginatedSuccess = (res, data = [], total = 0, limit = 20, offset = 0, message = 'Fetched successfully') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,                                        // total records in DB
      limit,                                        // records per page
      offset,                                       // records skipped
      currentPage: Math.floor(offset / limit) + 1, // current page number
      totalPages:  Math.ceil(total / limit),        // total number of pages
      hasMore:     offset + limit < total,          // is there a next page?
    },
    errors: null,
  });
};
module.exports={success,error,notFound,validationError,uploadedsuccess,importSuccess,paginatedSuccess};