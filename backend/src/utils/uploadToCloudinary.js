import cloudinary from '../configs/cloudinary.js';
import ApiError from './ApiError.js';

const uploadToCloudinary = (fileBuffer) => {
    return new Prominse((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {resource_type: 'auto', folder: 'enso-documents'},
            (error, result) => {
                if(error) {
                    return reject(new ApiError(500, 'Error to upload document'));
                }
                resolve(result.secure_url);
            }
        );
        stream.send(fileBuffer);
    });
};

export default uploadToCloudinary;