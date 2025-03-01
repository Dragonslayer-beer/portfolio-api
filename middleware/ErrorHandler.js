const handleError = (err, req, res, next) => {
  const { statusCode, message } = err;
  res.status(statusCode || 500).json({
    status: "error",
    statusCode: statusCode || 500,
    message: message || "Internal Server Error",
    errors: err && err.errors && err.errors[0].message || ""
  });
};

module.exports = { handleError };
