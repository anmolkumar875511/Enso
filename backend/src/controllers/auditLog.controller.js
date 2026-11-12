import { getAuditLogs } from "../services/auditLog.services.js";
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const list = asyncHandler(async(req, res) => {
    const { page, limit, action } = req.query;
    const data = await getAuditLogs(req.user.userId, {page, limit, action});
    res.status(200).json(new ApiResponse(200, data, 'Audit log fetched successfully'));
});