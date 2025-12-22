const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (!err.isOperational) {
    console.error("UNEXPECTED ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.isOperational
      ? err.message
      : "Something went wrong. Please try again later.",
  });
};

export default errorMiddleware;
