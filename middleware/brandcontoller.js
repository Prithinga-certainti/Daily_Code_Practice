const brand=require('../models/brandmodel');
const restaurent=require('../models/restaurentmodel');
const{createBrand,rejectSchema,suspendSchema}=require('../services/brandservice');
function validate(schema,data,res){
    const{error}=schema.validate(data);
    if(error){
        res.status(400).json({
            success:false,
            message:error.details[0].message
        });
        return false;
    }
    return true;
}
async function getAllBrands(req,res){
    try{
        const result=await Brand.getAllBrands(req.query);
        res.json({
            success:true,
            message:'Brands fetched successfully',
            data:result
        });
    }catch(err){
        next(err);
    }
}
async function getPendingBrands(req,res){
    try{
        const data=await brand.getPendingBrands();
        res.json({
            success:true,
            message:'Pending brands',
            data
        })
    }catch(err){
        next(err);
    }
}
async function createBrandHandler(req,res){
    try {
    if (!validate(createBrand, req.body, res)) 
        return;
    const brand = await Brand.create(req.body);
    res.status(201).json({
        success: true,
        message: 'Brand created',
        data: brand
    });
  } catch (err) { next(err); }
}
async function approveBrand(req, res, next) {
  try {
    const brand = await Brand.approve(req.params.id);
    if (!brand) 
    return res.status(404).json({ 
        success: false, 
        message: 'Brand not found' 
    });
    res.json({ 
        success: true, 
        message: 'Brand approved', 
        data: brand 
    });
  } catch(err){
    next(err); 
}
}

async function rejectBrand(req, res, next) {
  try {
    if (!validate(rejectSchema, req.body, res)) return;
    const brand = await Brand.reject(req.params.id, req.body.reason);
    if (!brand) 
        return res.status(404).json({ 
            success: false, 
            message: 'Brand not found' 
        });
    res.json({ 
        success: true, 
        message: 'Brand rejected', 
        data: brand 
    });
  }catch(err){
     next(err); 
    }
}

async function suspendBrand(req, res, next) {
  try {
    if (!validate(suspendSchema, req.body, res)) return;
    const brand = await Brand.suspend(req.params.id, req.body.reason);
    if (!brand) 
        return res.status(404).json({ 
            success: false, 
            message: 'Brand not found' 
        });
    res.json({ 
        success: true, 
        message: 'Brand suspended', 
        data: brand 
    });
  }catch(err){ 
    next(err); 
    }
}

async function reactivateBrand(req, res, next) {
  try {
    const brand = await Brand.reactivate(req.params.id);
    if (!brand) 
        return res.status(404).json({ 
            success: false, 
            message: 'Brand not found' 
        });
    res.json({ 
        success: true, 
        message: 'Brand reactivated', 
        data: brand 
    });
  }catch(err){
    next(err); 
    }
}