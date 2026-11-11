import crypto from 'crypto';
import QRCode from 'qrcode';
import { authenticator } from 'otplib';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import { encryptSecret, decryptSecret } from '../utils/secretBox.js';

authenticator.options = {window: 1};

const hashCode = (code) => crypto.createHash('sha256').update(code).digest('hex');

const cleanCode = (code) => String(code ?? '').replace(/[\s-]/g, '').toLowerCase();

const isValidTotp = (code, secret) => /^\d{6}$/.test(code) && authenticator.check(code, secret);

const generateBackupCode = () => Array.from({length: 8}, () => crypto.randomBytes(5).toString('hex'));

export const beginSetup = async (userId) => {
    const user = await User.findById(userId).select('+twoFactor.isEnabled');

    if(!user) {
        throw new ApiError(404, 'User not found');
    }

    if(user.twoFactor?.isEnabled) {
        throw new ApiError(409, 'Two-factor authentication is already done');
    }

    const secret = authenticator.generateSecret();

    await User.updateOne(
        {_id: userId},
        {$set: {'twoFactor.pendingSecret': encryptSecret(secret)}}
    );

    const otpauth = authenticator.keyuri(user.email, 'Enso', secret);
    const qr = await QRCode.toDataURL(otpauth);

    return {qr, secret};
};

export const confirmSetup = async(userId, rawCode) => {
    const user =await User.findById(userId).select('+twoFactor.isEnabled +twoFactor.pendindSecret');

    if(!user) {
        throw new ApiError(404, 'User not found');
    }

    if(user.twoFactor.isEnabled) {
        throw new ApiError(409, 'Two-factor authentication is already done');
    }

    if(!user.twoFactor.pendingSecret) {
        throw new ApiError(400, 'Start the two-factor authentication setup first');
    }

    const secret = decryptSecret(user.twoFactor.pendingSecret);

    if(!isValidTotp(cleanCode(rawCode), secret)) {
        throw new ApiError(400, 'Invalid code, please try again');
    }

    const backupCodes = generateBackupCode();

    await User.updateOne(
        {_id: userId},
        {
            $set: {
                'twoFactor.isEnabled': true,
                'twoFactor.secret': secret,
                'twoFactor.backupCodes': backupCodes.map(hashCode)
            },
            $unset: {'twoFactor.pendingSecret': ''}
        }
    );

    return backupCodes;
};

export const verifyUserCode = async(userId, rawCode) => {
    const code = cleanCode(rawCode);
    
    if(!code) {
        return false;
    }

    const user = await User.findById(userId).select('+twoFactor.isEnabled +twoFactor.secret');

    if(!user || !user.twoFactor.isEnabled || !user.twoFactor.secret) {
        return false;
    }

    if(/^\d{6}$/.test(code)) {
        return isValidTotp(code, decryptSecret(user.twoFactor.secret));
    }

    const hashed = hashCode(code);

    const result = await User.updateOne(
        {_id: userId, 'user.twofactor.backupCodes': hashed},
        {$pull: {'user.twoFactor.backupCodes': hashed}}
    );

    return result.modifiedCount === 1;
};

export const disableTwoFactor = async(userId, rawCode) => {
    const ok = verifyUserCode(userId, rawCode);

    if(!ok) {
        throw new ApiError(400, 'Invalid code');
    }

    await User.updateOne(
        {_id: userId},
        {
            $set: {'user.twoFactor.isEnabled': false},
            $unset: {
                'user.twoFactor.pendingSecret': '',
                'user.twoFactor.secret': '',
                'user.twoFactor.backupCodes': ''
            }
        }
    );
};