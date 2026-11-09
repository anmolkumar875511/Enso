import { setupVault, lockVault, unlockVault, getVaultStatus } from '../services/vault.services.js';
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
    res.status(201).json(new ApiResponse(201, null, 'Vault setup successful'));
});

export const unlock = asyncHandler(async (req, res) => {
    const vaultPassword = req.body.password;
    const userId = req.user.userId;

    if (!vaultPassword) {
        throw new ApiError(400, 'Password is required to unlock the vault');
    }

    await unlockVault(userId, vaultPassword);
    res.status(200).json(new ApiResponse(200, null, 'Vault unlocked successfully'));
});

export const lock = asyncHandler(async (req, res) => {
    lockVault(req.user.userId);
    res.status(200).json(new ApiResponse(200, null, 'Vault locked successfully'));
});

export const status = asyncHandler(async (req, res) => {
    const vaultStatus = await getVaultStatus(req.user.userId);
    res.status(200).json(new ApiResponse(200, vaultStatus, 'Vault status retrieved successfully'));
});