import { createDocument, getDocuments, deleteDocument } from '../services/document.services.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const create = asyncHandler(async (req, res) => {
    const document = await createDocument(req.user.userId, req.body);
    res.status(201).json(
        new ApiResponse(
            201,
            document,
            'Document created successfully'
        )
    );
});

export const get = asyncHandler(async (req, res) => {
    const documents = await getDocuments(req.user.userId);
    res.status(200).json(
        new ApiResponse(
            200,
            documents,
            'Fetched all documents successfully'
        )
    );
});

export const del = asyncHandler(async (req, res) => {
    await deleteDocument(req.body.id, req.user.userId);
    res.status(200).json(
        new ApiResponse(
            200,
            null,
            'Document deleted successfully'
        )
    );
});