import { getDEK } from '../utils/vaultSession.js';
import ApiError from '../utils/ApiError.js';

export default function requireUnlocked(req, res, next) {
    const userId = req.user.userId;
    const DEK = getDEK(userId);
    if(!DEK) {
        throw new ApiError(403, 'Vault is locked. Please unlock the vault to access this resource');
    }
    req.DEK = DEK;
    next();
}