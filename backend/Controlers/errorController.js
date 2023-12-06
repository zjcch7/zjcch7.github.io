const CustomError = require("../Utils/CustomError");

const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}`
    return new CustomError(msg, 400)
}

const duplicateKeyErrorHandler = (err) => {
    // Extracting the field name from the error message
    const fieldName = Object.keys(err.keyValue)[0];
    const fieldValue = err.keyValue[fieldName];
    const msg = `Duplicate entry: The ${fieldName} '${fieldValue}' is already in use.`;

    return new CustomError(msg, 400);
}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map(val = val.message);
    const errorMessages = errors.join('.');
    const msg = `Invalid input data: ${errorMessages}`;


    return new CustomError(msg, 400);
}

const jwtExpiredHandler = (err, next) => {

    return new CustomError('JWT has expired! please log in again.', 401);
}

const handleJWTError = (err) => {
    return new CustomError('invalid token! please log in again.', 401);
}

const prodErrors = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });

    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong, Please try again later.'
        })
    }
}

const devErrors = (res, error) => {
    res.status(error.statusCode || 500).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack
    });
};


module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devErrors(res, error);
    } else if (process.env.NODE_ENV === 'production') {
        if (error.name === 'CastError') error = castErrorHandler(error);
        if (error.code === 11000) error = duplicateKeyErrorHandler(error);
        if (error.name === 'ValidationError') error = validationErrorHandler(error); // Remove line for testing
        if (error.name === 'TokenExpiredError') error = jwtExpiredHandler(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

        prodErrors(res, error);
    }
}