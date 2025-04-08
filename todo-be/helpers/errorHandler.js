/**
 * Custom error handler utility function
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} [error=null] - Optional error object for additional details
 * @returns {Object} Formatted error response
 */
export const handleError = (res, statusCode, message, error = null) => {
  const errorResponse = {
    status: "error",
    message,
    data: error
      ? {
          error: error.message || error,
          stack:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        }
      : null,
  };

  return res.status(statusCode).json(errorResponse);
};

/**
 * Common error status codes and messages
 */
export const ErrorTypes = {
  BAD_REQUEST: {
    code: 400,
    message: "Bad Request",
  },
  UNAUTHORIZED: {
    code: 401,
    message: "Unauthorized",
  },
  FORBIDDEN: {
    code: 403,
    message: "Forbidden",
  },
  NOT_FOUND: {
    code: 404,
    message: "Resource not found",
  },
  INTERNAL_SERVER: {
    code: 500,
    message: "Internal server error",
  },
  VALIDATION_ERROR: {
    code: 422,
    message: "Validation error",
  },
};
