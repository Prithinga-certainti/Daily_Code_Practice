const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [${req.id}] ${req.method} ${req.url}`);
  next();
};
module.exports = { logger };
