import Document from '../models/document.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const createDocument = async(userId, {title, category, fileUrl, notes}) => {
    if(!userId) {
        throw new ApiError(404, 'User not found');
    }

    if(!category || !fileUrl) {
        throw new ApiError(400, 'Bad request, all fields are required');
    }

    const document = await Document.create({
        title: title,
        category: category,
        fileUrl: fileUrl,
        notes: notes,
        owner: UserId
    });

    return document;
};
