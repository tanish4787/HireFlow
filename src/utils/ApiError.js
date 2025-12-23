class ApiError extends Error {
  constructor(
    message = "Something went wrong!",
    statusCode = 500,
    errors = []
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
