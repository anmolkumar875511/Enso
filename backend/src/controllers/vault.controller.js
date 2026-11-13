import { setupVault, lockVault, unlockVault, getVaultStatus } from '../services/vault.services.js';
import { getDEK } from '../utils/vaultSession.js';
import { getRequestContext, logEvent } from '../services/audit.services.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const setup = asyncHandler(async (req, res) => {
    const vaultPassword = req.body.password;
    const userId = req.user.userId;

    if (!vaultPassword || vaultPassword.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters long');
    }

    await setupVault(userId, vaultPassword);
    await logEvent({ userId, action: 'vault_setup', ctx: getRequestContext(req) });

    res.status(201).json(new ApiResponse(201, null, 'Vault setup successful'));
});

export const unlock = asyncHandler(async (req, res) => {
    const vaultPassword = req.body.password;
    const userId = req.user.userId;
    const ctx = getRequestContext(req);

    if (!vaultPassword) {
        throw new ApiError(400, 'Password is required to unlock the vault');
    }

    try {
        await unlockVault(userId, vaultPassword);
    } catch (error) {
        if (error.statusCode === 403) {
            await logEvent({ userId, action: 'vault_unlock_failed', success: false, ctx });
        }
        throw error;
    }

    await logEvent({ userId, action: 'vault_unlock', ctx });

    res.status(200).json(new ApiResponse(200, null, 'Vault unlocked successfully'));
});

export const lock = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const wasUnlocked = getDEK(userId) !== null;

    lockVault(userId);

    if (wasUnlocked) {
        await logEvent({ userId, action: 'vault_lock', ctx: getRequestContext(req) });
    }

    res.status(200).json(new ApiResponse(200, null, 'Vault locked successfully'));
});

export const status = asyncHandler(async (req, res) => {
    const vaultStatus = await getVaultStatus(req.user.userId);
    res.status(200).json(new ApiResponse(200, vaultStatus, 'Vault status retrieved successfully'));
});