import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const storage = multer.memoryStorage();

const fileFilter = async(req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];
    if(!allowedTypes.includes(file.mimetype)) {
        return cb(new ApiError(400, 'Only PNG, JPEG, WEBP and PDF is allowed to upload'))
    }
    return cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1014 * 1024 }
});

export default upload;