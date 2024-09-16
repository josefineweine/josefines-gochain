import ErrorResponse from '../models/ErrorResponseModel.mjs';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Handle CastError
  if (err.name === 'CastError') {
    const message = `Resource with id: ${err.value} not found.`;
    error = new ErrorResponse(message, 404);
  }

  // Handle Duplicate Key Error (MongoError code 11000)
  if (err.code === 11000) {
    const message = `Duplicate key error: '${Object.keys(err.keyValue)[0]}'`;
    error = new ErrorResponse(message, 400);
  }

  // Handle Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Log to console for debugging (optional)
  console.error(error);

  // Send response
  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    error: error.message || 'Server Error',
  });
};
