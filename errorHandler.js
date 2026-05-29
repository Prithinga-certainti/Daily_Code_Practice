constlogger=require('../utils/logger');
const errorHandler=(err,req,res,next)=>{
    logger.error(`Error:${err.message} -${req.method} ${req.originalUrl} - ${req.ip}`);
    //multer file uploadinf error
    if(err.code ==="LIMIT_FILE_SIZE"){
        return res.status(400).json({
            success:false,
            message:"File size is large",
            errors:null,
        });
}
    if(err.code ==="LIMIT_UNEXPECTED_FILE"){
        return res.status(400).json({
            success:false,
            message:"Unexpected file",
            errors:null,
        });
    }
    if(err.code ==="INVALID_FILE_TYPE"){
        return res.status(400).json({
            success:false,
            message:"Invalid file type",
            errors:null,
        });
    }
    if(err.name=== "JsonWebTokenError"){
        return res.status(401).json({
            success:false,
            message:"Invalid token",
            errors:null,
        });
    }
    if(err.name === "TokenExpiredError"){
        return res.status(401).json({
            success:false,
            message:"Token expired",
            errors:null,
        });
    }
    if(err.code===23505){
        return res.status(400).json({
            success:false,
            message:"Duplicate entry",
            errors:null,
        });
    }
    const statusCode=err.statusCode || 500;
    res.status(statusCode).json({
        success:false,
        message:"Internal server error",
        errors:null,
    })
};
module.exports=errorHandler;