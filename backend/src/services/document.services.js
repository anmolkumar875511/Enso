import Document from '../models/document.model.js';
import ApiError from '../utils/ApiError.js';

export const createDocument = async (userId, { title, category, notes, fileUrl, originalName, mimeType, iv, authTag, isEncrypted }) => {
    if (!userId) {
        throw new ApiError(401, 'Unauthorized');
    }

    if (!category || !fileUrl) {
        throw new ApiError(400, 'Bad request, all fields are required');
    }

    await Document.create({
        title,
        category,
        fileUrl,
        notes,
        owner: userId,
        originalName,
        mimeType,
        iv,
        authTag,
        isEncrypted
    });

    return true;
};

export const getDocuments = async (userId) => {
    const documents = await Document.find({ owner: userId, isDeleted: false }).sort({ uploadDate: -1 });
    return documents;
};

export const deleteDocument = async (documentId, userId) => {
    if (!documentId) {
        throw new ApiError(400, 'Missing document id');
    }

    const result = await Document.updateOne(
        { _id: documentId, owner: userId, isDeleted: false },
        { isDeleted: true }
    );

    if (result.modifiedCount === 0) {
        throw new ApiError(404, 'Document not found');
    }
};
