import { useState } from 'react';
import api from '../api/axios.js';

function TwoFactorSettings({ enabled, onChanged }) {
    const [step, setStep] = useState('idle'); // 'idle' | 'scan' | 'codes' | 'disabling'
    const [qr, setQr] = useState('');
    const [secret, setSecret] = useState('');
    const [code, setCode] = useState('');
    const [backupCodes, setBackupCodes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const reset = () => {
        setStep('idle');
        setQr('');
        setSecret('');
        setCode('');
        setError('');
    };

    const handleStart = async () => {
        setError('');
        try {
            setLoading(true);
            const res = await api.post('/2fa/setup');
            setQr(res.data.data.qr);
            setSecret(res.data.data.secret);
            setStep('scan');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not start setup');
        } finally {
            setLoading(false);
        }
    };

    const handleEnable = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const res = await api.post('/2fa/enable', { code });
            setBackupCodes(res.data.data.backupCodes);
            setCode('');
            setQr('');
            setSecret('');
            setStep('codes');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not enable 2FA');
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            await api.post('/2fa/disable', { code });
            reset();
            onChanged();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not disable 2FA');
        } finally {
            setLoading(false);
        }
    };

    const handleCodesSaved = () => {
        setBackupCodes([]);
        reset();
        onChanged();
    };

    return (
        <>
            <h3>Security</h3>

            {step === 'idle' && !enabled && (
                <>
                    <p>Two-factor authentication: OFF</p>
                    <button onClick = {handleStart} disabled = {loading}>Enable 2FA</button>
                </>
            )}

            {step === 'idle' && enabled && (
                <>
                    <p>Two-factor authentication: ON</p>
                    <button onClick = {() => setStep('disabling')}>Disable 2FA</button>
                </>
            )}

            {step === 'scan' && (
                <form onSubmit = {handleEnable}>
                    <p>1. Scan this QR code with Google Authenticator or Authy.</p>
                    <img src = {qr} alt = 'Scan this QR code to set up 2FA' />
                    <p>Can't scan? Type this key in your app: <code>{secret}</code></p>
                    <p>2. Enter the 6-digit code from the app.</p>
                    <input
                        placeholder = '6-digit code'
                        value = {code}
                        onChange = {(e) => setCode(e.target.value)}
                        autoComplete = 'one-time-code'
                    />
                    <button type = 'submit' disabled = {loading}>
                        {loading ? 'Checking...' : 'Confirm'}
                    </button>{' '}
                    <button type = 'button' onClick = {reset}>Cancel</button>
                </form>
            )}

            {step === 'codes' && (
                <>
                    <p>2FA is now ON. Save these backup codes now. You will not see them again.</p>
                    <p>Each code works only once, if you lose your phone.</p>
                    <ul>
                        {backupCodes.map((c) => (
                            <li key = {c}><code>{c}</code></li>
                        ))}
                    </ul>
                    <button onClick = {handleCodesSaved}>I have saved these codes</button>
                </>
            )}

            {step === 'disabling' && (
                <form onSubmit = {handleDisable}>
                    <p>Enter a code from your app (or a backup code) to turn 2FA off.</p>
                    <input
                        placeholder = 'Code'
                        value = {code}
                        onChange = {(e) => setCode(e.target.value)}
                        autoComplete = 'one-time-code'
                    />
                    <button type = 'submit' disabled = {loading}>
                        {loading ? 'Checking...' : 'Disable'}
                    </button>{' '}
                    <button type = 'button' onClick = {reset}>Cancel</button>
                </form>
            )}

            {error && <p>{error}</p>}
        </>
    );
}

export default TwoFactorSettings;