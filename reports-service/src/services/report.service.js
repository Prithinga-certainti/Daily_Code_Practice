const reportRepository = require('../repositories/report.repository');
const getorderReport=async (filters)=>{
    if(!filters.from || !filters.to){
        throw new Error("From and To dates are required");
    }
    return reportRepostory.getorderReport(filters);
}
const getSalesReport=async (filters)=>{
    if(!filters.from || !filters.to){
        throw new Error("From and To dates are required");
    }
    return reportRepostory.getSalesReport(filters);
}
const getDeliveryReport=async (filters)=>{
    if(!filters.from || !filters.to){
        throw new Error("From and To dates are required");
    }
    return reportRepostory.getDeliveryReport(filters);
}
module.exports={
    getorderReport,
    getSalesReport,
    getDeliveryReport
}