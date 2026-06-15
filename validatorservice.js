const UPLOAD_CONSTANTS=require('./uploadConstants');
const validateRow=(row,rowIndex)=>{
    const errors=[];
    const sanitizedRow={};
    for(const col of UPLOAD_CONSTANTS.TEMPLATE_COLUMNS){
        if(!row[col] || row[col].trim() === ''){
            errors.push(`${col} is required`);
        }
    }
    if(errors.length>0){
        return{isValid:false, error:errors.join(','),sanitizedRow:null};
    }
    sanitized.item_name=String(row.item_name).trim();
    sanitized_category=String(row.sub_category).trim();
    sanitized_sub_category=String(row.sub_category).trim();
    sanitized_description=String(row.description).trim();
    const price=parseFloat(row.price);
    if(isNan(price) || price<0){
        errors.push('price must be positive number');
    }else{
        sanitized_price=price;
    }
    //discount price
    if(row.discount_price && row.discount_price.trim() !== ''){
        const discountPrice=parseFloat(row.discount_price);
        if(isNaN(discountPrice) || discountPrice<0){
            errors.push('discount_price must be positive number');
        }else if(discountPrice>price){
            errors.push('discount_price must be less than or equal to price');
        }else{
            sanitized_discount_price=discountPrice;
        }
    }
    //tax percentage
    const taxPercentage=parseFloat(row.tax_percentage);
    if(isNaN(taxPercentage) || !UPLOAD_CONSTANTS.TAX_PERCENTAGES.includes(taxPercentage)){
        errors.push(`tax_percentage must be one of ${UPLOAD_CONSTANTS.TAX_PERCENTAGES.join(',')}`);
    }else{
        sanitized_tax_percentage=taxPercentage;
    }
    //food type
    if(!UPLOAD_CONSTANTS.FOOD_TYPES.includes(row.food_type)){
        errors.push(`food_type must be one of ${UPLOAD_CONSTANTS.FOOD_TYPES.join(',')}`);
    }else{
        sanitized_food_type=row.food_type;
    }
    //spice level
    if(!UPLOAD_CONSTANTS.SPICE_LEVELS.includes(row.spice_level)){
        errors.push(`spice_level must be one of ${UPLOAD_CONSTANTS.SPICE_LEVELS.join(',')}`);
    }else{
        sanitized_spice_level=row.spice_level;
    }
    //status
    if(!UPLOAD_CONSTANTS.ITEM_STATUS.includes(row.status)){
        errors.push(`status must be one of ${UPLOAD_CONSTANTS.ITEM_STATUS.join(',')}`);
    }else{
        sanitized_status=row.status;
    }
    //calories
    if(row.calories && row.calories.trim() !== ''){
        const calories=parseInt(row.calories,10);
        if(isNaN(calories) || calories<0){
            errors.push('calories must be positive integer');
        }else{
            sanitized_calories=calories;
        }
    }
    //image url
    sanitized_image_url=row.image_url?String(row.image_url).trim():null;
    //allergens
    sanitized_allergens=row.allergens?String(row.allergens).trim():null;
    //packing charge
    if(row.packing_charge && row.packing_charge.trim() !== ''){
    const charge = parseFloat(row.packing_charge);
    if(isNaN(charge) || charge < 0){
        errors.push('packing_charge must be a positive number');
    }else{
        sanitized_packing_charge=charge;
    }
}
    //display order
    if(row.display_order && row.display_order.trim() !== ''){
        const displayOrder = parseInt(row.display_order,10);
        if(isNaN(displayOrder) || displayOrder < 0){
            errors.push('display_order must be a positive integer');
        }else{
            sanitized_display_order=displayOrder;
        }
    }
    // boolean fields
    sanitized.is_featured = row.is_featured === 'true' || row.is_featured === true;
    sanitized.is_bestseller = row.is_bestseller === 'true' || row.is_bestseller === true;
    sanitized.is_customizable = row.is_customizable === 'true' || row.is_customizable === true;
    // available from to to
    sanitized.available_from = row.available_from ? new Date(row.available_from) : null;
    sanitized.available_to = row.available_to ? new Date(row.available_to) : null;
    if (errors.length > 0) {
    return { isValid: false, error: errors.join(', '), sanitized: null };
  }
  return { isValid: true, error: null, sanitized };
};
module.exports={validateRow};
