import Document from '../models/document.model.js';
import ApiError from '../utils/ApiError.js';

export const createDocument = async (userId, { title, category, fileUrl, notes }) => {
    if (!userId) {
        throw new ApiError(401, 'Unauthorized');
    }

    if (!category || !fileUrl) {
        throw new ApiError(400, 'Bad request, all fields are required');
    }

    const document = await Document.create({
        title,
        category,
        fileUrl,
        notes,
        owner: userId,
    });

    return document;
};

export const getDocuments = async (userId) => {
    const documents = await Document.find({ owner: userId });
    return documents;
};

export const deleteDocument = async (documentId, userId) => {
    if (!documentId) {
        throw new ApiError(400, 'Missing document id');
    }

    const result = await Document.deleteOne({ _id: documentId, owner: userId });

    if (result.deletedCount === 0) {
        throw new ApiError(404, 'Document not found');
    }
};
