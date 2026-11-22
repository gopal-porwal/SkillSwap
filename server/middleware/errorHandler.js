const errorHandler = (err, req, res, next) => {

  console.error("GLOBAL ERROR:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Server Error",
  });

};

module.exports = errorHandler;