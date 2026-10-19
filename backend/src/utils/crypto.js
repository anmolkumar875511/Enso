import crypto from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(crypto.scrypt);

const ALGO = 'aes-256-gcm';
const KEY_LEN = 32;
const IV_LEN = 12;
const SALT_LEN = 16;

const SCRYPT_OPTS = {N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024};

export const generateSalt = () => {
    return crypto.randomBytes(SALT_LEN).toString('hex');
};

export const deriveKEK = async(vaultPassword, saltHex) => {
    return scrypt(
        vaultPassword,
        Buffer.from(saltHex, 'hex'),
        KEY_LEN,
        SCRYPT_OPTS
    );
};

export const generateDEK = () => {
    return crypto.randomBytes(KEY_LEN);
};

export const encryptBuffer = (buffer, key) => {
    const iv = crypto.randomBytes(IV_LEN);
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return { encrypted, iv, authTag };
};

export const decryptBuffer = ({ encrypted, iv, authTag }, key) => {
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};

export const wrapKey = (DEK, KEK) => {
    const { encrypted, iv, authTag } = encryptBuffer(DEK, KEK);
    return {
        wrappedDEK: encrypted.toString('hex'),
        DEKiv: iv.toString('hex'),
        DEKAuthTag: authTag.toString('hex')
    }
};

export const unwrapKey = ({wrappedDEK, DEKiv, DEKAuthTag}, KEK) => {
    try {
        return decryptBuffer(
            {
                encrypted: Buffer.from(wrappedDEK, 'hex'),
                iv: Buffer.from(DEKiv, 'hex'),
                authTag: Buffer.from(DEKAuthTag, 'hex')
            },
            KEK
        );
    } catch (error) {
        throw new Error("Invalid vault password");
    }
}