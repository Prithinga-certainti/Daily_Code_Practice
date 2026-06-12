const fs = require ('fs');
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const validateData = require('./validateData');
const UPLOAD_CONSTANTS = require('../constants/uploadConstants');
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data',(row)=>results.push(row))
            .on('end',(row)=>resolve(results))
            .on('error',(error)=>resolve(error));
            .on('error',(error)=>reject(error));
});
};
const parseXLSX = (filePath) => {    
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const row=xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return row;
}
const parseFile = async (filePath) => {
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    let rows=[];
    if(ext === UPLOAD_CONSTANTS.CSV){
        rows = await parseCSV(filePath);
    }
    else if(ext === UPLOAD_CONSTANTS.XLSX){
        rows = parseXLSX(filePath);
    }
    else{
        throw new Error('Invalid file type');
    }
    if(rows.length > uploadConstants.MAX_ROWS){
        throw new Error(`File exceeds maximum row limit of ${uploadConstants.MAX_ROWS}`);
    }
    if(rows.length === 0){
        throw new Error('No data found in file');
    }
    return rows ;
}
const validateRows = async (rows) => {
    const validRows = [];
    const invalidRows = [];
    const errors = [];
    for(let i=0 ; i< rows.length;i++){
        const {isvalid ,error , sanitized}=validatorService.validateRow(rows[i]);  
        if(isvalid){
            validRows.push(sanitized);
        }else{
            invalidRows.push(rows[i]);
            errors.push({row: i+1, error});
        }
    }
    return {validRows, invalidRows, errors};
}
module.exports={parseFile, validateRows}