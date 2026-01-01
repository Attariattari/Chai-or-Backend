class ApiError extends Error {
  constructor(
    message = "Something went wrong", // first argument = error message
    statusCode = 500,                // second argument = status code
    errors = [],                      // optional detailed errors array
    stack = ""                        // optional custom stack trace
  ) {
    super(message);                   // Error base class ko message pass karo

    this.statusCode = statusCode;     // HTTP status code
    this.success = false;             // always false
    this.errors = errors;             // extra validation / field errors
    this.data = null;                 // optional data holder
    this.message = message;           // ensure message exists

    // stack trace fix
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
