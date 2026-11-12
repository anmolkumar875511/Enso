import { encryptBuffer, decryptBuffer } from './crypto.js';
import ApiError from './ApiError.js';

const getKey = () => {
    const key = process.env.TOTP_ENC_KEY;
    if(!key || key.length !== 64) {
        throw new ApiError(500, 'TOTP_ENC_KEY is missing or invalid.')
    }
    return Buffer.from(key, 'hex');
};

export const encryptSecret = (text) => {
    const { encrypted, iv, authTag } = encryptBuffer(Buffer.from(text, 'utf8'), getKey());
    return [iv, authTag, encrypted].map((m) => m.toString('hex')).join(':');
};

export const decryptSecret = (stored) => {
    const [iv, authTag, data] = stored.split(':');
    return decryptBuffer({
        encrypted: Buffer.from(data, 'hex'),
        iv: Buffer.from(iv, 'hex'),
        authTag: Buffer.from(authTag, 'hex')
    }, getKey())
    .toString('utf8');
};