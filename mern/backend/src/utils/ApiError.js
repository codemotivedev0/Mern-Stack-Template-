// Throw this from a controller to send a specific status code:
//   throw new ApiError(404, 'User not found');
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ApiError;
