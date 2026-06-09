const {Router}=require('express');
const {authenticate,authorizeAdmin}=require('../middlewares/auth.middleware');
const reportController=require('../controllers/report.controller');
const router=Router();
router.use(authenticate, authorizeAdmin);
router.get('/orders', reportController.getOrderReport);
router.get('/sales', reportController.getSalesReport);
router.get('/deliveries', reportController.getDeliveryReport);
module.exports=router;
