class CustomError extends Error {
    constructor(message, statusCode) {
        super(message); // Pass the message to the parent class (Error)
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // If status code starts with 4, it's a fail, else it's an error
        this.isOperational = true; // To distinguish between expected operational errors vs unknown errors (useful for logging)

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;