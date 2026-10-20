import { generateSalt, deriveKEK, generateDEK, wrapKey, unwrapKey } from '../utils/crypto.js';
import { setDEK, clearDEK } from '../utils/valutSession.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

export const setupVault = async(userId, vaultPassword) => {
    const user = await User.findById(userId).select('+vault.isSetup');
    
    if(!user) {
        throw new ApiError(401, 'User not found');
    }

    if(user.vault?.isSetup) {
        throw new ApiError(402, 'Valut already setup');
    }

    const salt = generateSalt();
    const KEK = await deriveKEK(vaultPassword, salt);
    const DEK = generateDEK();
    const { wrappedDEK, DEKiv, DEKAuthTag } = wrapKey(DEK, KEK);

    user.vault.salt = salt;
    user.vault.wrappedDEK = wrappedDEK;
    user.vault.DEKiv = DEKiv;
    user.vault.DEKAuthTag = DEKAuthTag;
    user.vault.isSetup = true;
    await user.save();

    setDEK(userId, DEK);
    KEK.fill(0);
};

export const unlockVault = async(userId, vaultPassword) => {
    const user = await User.findById(userId).select(
        '+vault.salt +vault.wrappedDEK +vault.DEKiv +vault.DEKAuthTag +vault.isSetup'
    );

    if(!user) {
        throw new ApiError(401, 'User not found');
    }

    if(!user.vault?.isSetup) {
        throw new ApiError(403, 'Vault is not setup');
    }

    const KEK = deriveKEK(vaultPassword, user.vault.salt);
    const DEK = unwrapKey(user.vault, KEK);

    KEK.fill(0);
    setDEK(userId, DEK);
};

export const lockVault = (userId) => {
    clearDEK(userId);
};