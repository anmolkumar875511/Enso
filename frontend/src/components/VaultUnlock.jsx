import { useState } from 'react';
import api from '../api/axios.js';

function VaultUnlock({ onDone, onCancel }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!password) {
            setError('Please enter your vault password');
            return;
        }

        try {
            setLoading(true);
            await api.post('/vault/unlock', { password });
            onDone();
        } catch (err) {
            setError(err.response?.data?.message || 'Unlock failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit = {handleSubmit}>
                <input
                    type = 'password'
                    placeholder = 'Vault password'
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                    autoFocus
                />
                <button type = 'submit' disabled = {loading}>
                    {loading ? 'Unlocking...' : 'Unlock'}
                </button>{' '}
                <button type = 'button' onClick = {onCancel}>Cancel</button>
            </form>
            {error && <p>{error}</p>}
        </>
    );
}

export default VaultUnlock;