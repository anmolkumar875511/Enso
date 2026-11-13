import { createDocument, getDocuments, deleteDocument, downloadDocument } from '../services/document.services.js';
import { getRequestContext, logEvent } from '../services/auditLog.services.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js'
import { encryptBuffer, decryptBuffer } from '../utils/crypto.js';

export const create = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, 'No file to upload');
    }

       const { originalname: originalName, mimetype: mimeType } = req.file;

    const { encrypted, iv, authTag } = encryptBuffer(req.file.buffer, req.DEK);

    const fileUrl = await uploadToCloudinary(encrypted);

    const document = await createDocument(req.user.userId, {
       ...req.body, fileUrl, originalName, mimeType,
       iv: iv.toString('hex'),
       authTag: authTag.toString('hex'),
       isEncrypted: true
   });

    await logEvent({
        user: req.user.userID,
        document: document._id,
        action: 'document_created',
        resourceName: document.originalName,
        ctx: getRequestContext(req)
    });

    res.status(201).json(
        new ApiResponse(
            201,
            { 'title': document.title, 'name': document.originalName },
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
    const document = await deleteDocument(req.body.id, req.user.userId);

    await logEvent({
        user: req.user.userId,
        document: document._id,
        action: 'document_delete',
        resourceName: document.originalName,
        ctx: getRequestContext(req)
    });

    res.status(200).json(
        new ApiResponse(
            200,
            null,
            'Document deleted successfully'
        )
    );
});

export const download = asyncHandler(async (req, res) => {
    const document = await downloadDocument(req.params.id, req.user.userId);

    if (!document.isEncrypted) {
        throw new ApiError(400, 'Document is not encrypted, cannot decrypt');
    }

    if (!req.DEK) {
        throw new ApiError(403, 'Vault is locked');
    }

    if (!document.fileUrl) {
        throw new ApiError(404, 'File URL not found for the document');
    }

    const fileRes = await fetch(document.fileUrl);

    if (!fileRes.ok) {
        throw new ApiError(502, 'Failed to fetch the document from cloud storage');
    }

    const encrypted = Buffer.from(await fileRes.arrayBuffer());

    let decryptedBuffer;
    try {
        decryptedBuffer = decryptBuffer({
            encrypted,
            iv: Buffer.from(document.iv, 'hex'),
            authTag: Buffer.from(document.authTag, 'hex')
        }, req.DEK);
    } catch (error) {
        throw new ApiError(500, 'Failed to decrypt the document');
    }

    await logEvent({
        user: req.user.userId,
        document: document._id,
        action: 'document_download',
        resouceName: document.originalName,
        ctx: getRequestContext
    });

    res.attachment(document.originalName);
    res.setHeader('Content-Type', document.mimeType);
    res.send(decryptedBuffer);
});