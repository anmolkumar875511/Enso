import cloudinary from '../config/cloudinary.js';
import ApiError from './ApiError.js';

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'enso-documents' },
            (error, result) => {
                if (error) {
                    return reject(new ApiError(500, 'File upload failed'));
                }
                resolve(result.secure_url);
            }
        );
        stream.end(fileBuffer);
    });
};

export default uploadToCloudinary;