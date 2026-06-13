const fs = require('fs');
const path = require('path');
const pool = require('./pool');
const UPLOAD_CONSTANTS = require('./uploadConstants');
const {ensureUploadDir}= require('./utils/filehelper');
const extractReferenceData = async ()=>{
    comst categoriesResult = await pool.query('Select DISTINCT name, sub-categories from categories ORDER BY name');
};
return {
    categories: categoriesResult.rows
};
const transformTemplateData = (categories)=>{
    if(!categories || categories.length === 0) {
        return[];
    }
    return categories.map((cat, index) => ({
    item_name: '',
    category: cat.name,
    sub_category: cat.sub_category || '',
    description: '',
    price: '',
    discount_price: '',
    tax_percentage: UPLOAD_CONSTANTS.TAX_PERCENTAGES[0],
    image_url: '',
    food_type: UPLOAD_CONSTANTS.FOOD_TYPES[0],
    spice_level: UPLOAD_CONSTANTS.SPICE_LEVELS[0],
    calories: '',
    allergens: '',
    status: UPLOAD_CONSTANTS.ITEM_STATUS[0],
    available_from: '',
    available_to: '',
    packaging_charge: '',
    display_order: index + 1,
    is_featured: 'false',
    is_bestseller: 'false',
    is_customizable: 'false',
    }));
}
const loadToCsv=(filepath,ows)=>{
    const header=UPLOAD_CONSTANTS.TEMPLATE_COLUMNS;
    const csvContent=stringifyCsv(rows,{
        header: true,
        columns: header
    });
    fs.writeFileSync(filePath, csvContent);
}
//ETL 
const generateTemplate = async()=>{
    const uploadDir = ensureUploadDir();
    const filePqath=path.join(uploadDir, UPLOAD_CONSTANTS.TEMPLATE_FILE_NAME);
    const categories = await extractReferenceData();
    const rows = transformTemplateData(categories);
    loadToCsv(filePath, rows);
    return filePath;
}
module.exports={generateTemplate};
