import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

function Vault() {
    const [mode, setMode] = useState(null); // 'setup' | 'unlock'
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await api.get('/vault/status');
                const { isSetup, isUnlocked } = res.data.data;

                if (isUnlocked) {
                    navigate('/dashboard', { replace: true });
                    return;
                }

                setMode(isSetup ? 'unlock' : 'setup');
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate('/login', { replace: true });
                    return;
                }
                setError(err.response?.data?.message || 'Unable to check vault status');
            }
        };
        checkStatus();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'setup') {
            if (password.length < 8) {
                setError('Vault password must be at least 8 characters');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }

        if (!password) {
            setError('Please enter your vault password');
            return;
        }

        try {
            setLoading(true);
            const endpoint = mode === 'setup' ? '/vault/setup' : '/vault/unlock';
            await api.post(endpoint, { password });
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!mode) {
        return error ? <p>{error}</p> : <p>Loading...</p>;
    }

    return (
        <>
            <h2>{mode === 'setup' ? 'Set up your vault' : 'Unlock your vault'}</h2>

            {mode === 'setup' && (
                <p>
                    Warning: this password encrypts your files and cannot be recovered.
                    If you forget it, your documents can never be opened again.
                </p>
            )}

            <form onSubmit = {handleSubmit}>
                <input
                    type = 'password'
                    placeholder = 'Vault password'
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                />

                {mode === 'setup' && (
                    <input
                        type = 'password'
                        placeholder = 'Confirm vault password'
                        value = {confirmPassword}
                        onChange = {(e) => setConfirmPassword(e.target.value)}
                    />
                )}

                <button type = 'submit' disabled = {loading}>
                    {loading ? 'Please wait...' : mode === 'setup' ? 'Create vault' : 'Unlock'}
                </button>
            </form>

            {error && <p>{error}</p>}
        </>
    );
}

export default Vault;