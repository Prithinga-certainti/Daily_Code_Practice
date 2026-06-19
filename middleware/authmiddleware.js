const jwt=equire('jsonwebtoken');
const {error}=require('./utils/response');
require('dotenv').config();
const authMiddleware = (req, res, next) => {
    const authHeader=req.headers.authorization;
    if(!authHeader||!authHeader.startswith('Bearer ')){
        return error(res,"Unauthorized token",401);
    }
    const token=authHeader.split(' ')[1];
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decode;
        next();
    }catch(err){
        return error(res,"Invalid token",401);
    }
    }
const isAdmin=(req,res,next)=>{
    if(req.user.role!=='admin'){
        return error(res, "Access Devined",403);
    }
    next();
}    
const isOwner=(req,res,next)=>{
    if(req.user.role!=='owner'){
        return error(res, "Access Devined",403);
    }
    next();
}
const isAdminOrOwner=(req,res,next)=>{
    if(req.user.role!=='admin' && req.user.role!=='owner'){
        return error(res, "Access Devined",403);
    }
    next();
}
module.exports={authMiddleware,isAdmin,isOwner,isAdminOrOwner};