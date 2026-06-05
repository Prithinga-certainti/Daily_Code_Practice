const express=require('express');
const app=express();
app.use(express.json());
function logger(req,res,next){
    console.log(`[${new Date().toISOString()}]${req.method}${req.url}`);
    next();
}
function requestTime(req,res,next){
    req.requestTime=new Data();
    next();
}
function authGuard(req,res,next){
    const token=req.headers.authorization;
    if(token!=="mysecrettoken"){
        return res.status(401).json({
            message:"Unauthorized"
        });
    }
    next();
}
const requestsCount={};
const RATE_LIMIT=100;
const WINDOW_SIZE=60*1000;
function rateLimiter(req,res,next){
    const ip=req.ip;
    const now=Date.now();
    if(!requestsCount[ip]){
        requestsCount[ip]={count:1 ,resetTime:now + WINDOW_SIZE};
        return next();
    }
    if(now > requestsCount[ip].resetTime){
        requestsCount[ip]={count:1 ,resetTime:now + WINDOW_SIZE};
        return next();
    }
    if(requestsCount[ip].count >= RATE_LIMIT){
        return res.status(429).json({
            message:"Too Many Requests"
        });
    }
    requestsCount[ip].count++;
    next();

}
app.use(logger);
app.use(requestTime);
app.use(authGuard);
app.get('public',(req,res)=>{
    res.json({ message :" All can access"})
});
app.get('private',(req,res)=>{
    res.json({ message :" Only authorized can access", requestTime:req.requestTime})
});
app.listen(3000,()=>{
    console.log("Server Running in port 3000");
});
