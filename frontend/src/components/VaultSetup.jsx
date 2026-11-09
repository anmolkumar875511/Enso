import { useState } from 'react';
import api from '../api/axios.js';

function VaultSetup({ onDone }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Vault password must be at least 8 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            await api.post('/vault/setup', { password });
            onDone();
        } catch (err) {
            setError(err.response?.data?.message || 'Vault setup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h3>Set up your vault</h3>
            <p>
                Warning: this password encrypts your files and cannot be recovered.
                If you forget it, your documents can never be opened again.
            </p>
            <form onSubmit = {handleSubmit}>
                <input
                    type = 'password'
                    placeholder = 'Vault password'
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                />
                <input
                    type = 'password'
                    placeholder = 'Confirm vault password'
                    value = {confirmPassword}
                    onChange = {(e) => setConfirmPassword(e.target.value)}
                />
                <button type = 'submit' disabled = {loading}>
                    {loading ? 'Creating...' : 'Create vault'}
                </button>
            </form>
            {error && <p>{error}</p>}
        </>
    );
}

export default VaultSetup;