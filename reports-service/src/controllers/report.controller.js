const reportRepository = require('../repositories/report.repository');
const getOrderReport = async (req, res, next) => {
    try{
        const data =await reportService.getOrderReport(req.query);
        res.json({
            success:true,
            data
        })
        }catch(err){
            next(err);
    }
}
const getSalesReportb=async(req,res,next)=>{
    try{
        const data =await reportService.getSalesReport(req.query);
        res.json({
            success:true,
            data
        })
        }catch(err){
            next(err);
    }
}
const getDeliveryReport=async(req,res,next)=>{
    try{
        const data=await reportService.getDeliveryReport(req.query);
        res.json({
            success:true,
            data
        })
    }
    catch(err){
        next(err);
    }
}
module.exports={getOrderReport,getSalesReport,getDeliveryReport}
