import ApiResponse from '../utils/ApiResponse.js';

export const errorHandler = async(err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    if(!err.statusCode) {
        console.error('Unexpected error:', err);
    }
    res.status(statusCode).json(
        new ApiResponse(
            statusCode,
            null,
            message
        )
    );
};