import { setupVault, lockVault, unlockVault } from '../services/vault.services.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const setup = asyncHandler(async (req, res) => {
    try {
        const vaultPassword = req.body.password;
        const userId = req.user.userId;
        if(!userId) {
            throw new ApiError(400, 'Unauthenticated user cannot setup the vault');
        }
        if(!vaultPassword || vaultPassword.length < 8) {
            throw new ApiError(400, 'Password must be at least 8 characters long');
        }
        await setupVault(userId, vaultPassword);
        res.status(201).json(new ApiResponse(201, 'Vault setup successful'));
    } catch (error) {
        throw new ApiError(500, 'Failed to setup vault');
    }
});

export const unlock = asyncHandler(async(req, res) => {
    try {
        const vaultPassword = req.body.password;
        const userId = req.user.userId;
        if(!userId) {
            throw new ApiError(400, 'Unauthenticated user cannot unlock the vault');
        }
        if(!vaultPassword) {
            throw new ApiError(400, 'Password is required to unlock the vault');
        }
        await unlockVault(userId, vaultPassword);
        res.status(200).json(new ApiResponse(200, 'Vault unlocked successfully'));
    } catch (error) {
        throw new ApiError(500, 'Failed to unlock vault');
    }
});

export const lock = asyncHandler(async(req, res) => {
    try {
        const userId = req.user.userId;
        if(!userId) {
            throw new ApiError(400, 'Unauthenticated user cannot lock the vault');
        }
        lockVault(userId);
        res.status(200).json(new ApiResponse(200, 'Vault locked successfully'));
    } catch (error) {
        throw new ApiError(500, 'Failed to lock vault');
    }
});