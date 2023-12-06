// errorHandlingMiddleware.js

module.exports = (err, req, res, next) => {
    // Default status and message
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    res.status(statusCode).json({
        status: status,
        message: err.message
    });
};