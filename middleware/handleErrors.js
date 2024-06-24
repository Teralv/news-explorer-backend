const { isCelebrateError } = require('celebrate');
const logger = require('./logger');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class ServerError extends Error {
  constructor(message = 'Internal Server Error!') {
    super(message);
    this.statusCode = 500;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

const errorHandler = (err, req, res, next) => {
  const logMessage = `${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`;

  // Check if the error is a known type and handle it
  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError ||
    err instanceof ConflictError ||
    err instanceof ServerError
  ) {
    logger.error(logMessage); // Log known type errors to error.log
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Handle validation errors (e.g., from Joi/Celebrate)
  if (isCelebrateError(err)) {
    const details =
      err.details.get('body') ||
      err.details.get('query') ||
      err.details.get('params');
    logger.error(
      `Validation Error: ${JSON.stringify(details)} - ${logMessage}`,
    ); // Log validation errors to error.log
    return res.status(400).json({
      message: 'Validation failed',
      details,
    });
  }

  // For unhandled errors, log them and respond with 500 Internal Server Error
  logger.error(`Unhandled Error: ${logMessage}`); // Log unhandled errors to error.log
  return res.status(500).send('Internal Server Error!!' );
};

module.exports = {
  errorHandler,
  UnauthorizedError,
};