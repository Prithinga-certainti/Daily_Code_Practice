const express=require('express');
const {logger}=require('./middlewares/logger.middleware');
const {requestId}=require('./middlewares/requestId.middleware');
const {requestTimer}=require('./middlewares/requestTimer.middleware');
const {rateLimiter}=require('./middlewares/rateLimiter.middleware');
const reportRoutes=require('./routes/report.routes');
const app=express();
app.use(express.json());
app.use(requestId);
app.use(logger);
app.use(requestTimer);
app.use(rateLimiter);
app.get('/health', (req, res) => res.json({ 
    status: 'ok', 
    service: 'foodigi-reports' 
}));
app.use('/api/reports', reportRoutes);
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ 
    success: false,
     error: err.message || 'Internal server error' });
});
module.exports=app;
