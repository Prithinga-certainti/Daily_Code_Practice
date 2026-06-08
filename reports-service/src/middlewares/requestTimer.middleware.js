const requestTimer = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${req.id}] ${req.method} ${req.url} - ${Date.now() - start}ms - ${res.statusCode}`);
  });
  next();
};

module.exports = { requestTimer };

