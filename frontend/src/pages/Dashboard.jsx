import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import UploadForm from '../components/FormData.jsx';
import DocumentList from '../components/DocumentList.jsx';
import TwoFactorSettings from '../components/TwoFactorSettings.jsx';
import VaultSetup from '../components/VaultSetup.jsx';
import VaultUnlock from '../components/VaultUnlock.jsx';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [vaultState, setVaultState] = useState(null); // 'setup' | 'locked' | 'unlocked'
    const [showUnlock, setShowUnlock] = useState(false);
    const [error, setError] = useState('');
    const [docError, setDocError] = useState('');
    const navigate = useNavigate();

    const fetchDocuments = async() => {
        try {
            const res = await api.get('/documents/get');
            setDocuments(res.data.data);
            setDocError('');
        }
        catch (error) {
            setDocError(error.response?.data?.message || 'Unable to fetch documents');
        }
    };

    const fetchUser = async() => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Unable to fetch user details');
        }
    };

    const handleVaultReady = () => {
        setVaultState('unlocked');
        setShowUnlock(false);
        fetchDocuments();
    };

    const handleVaultLocked = () => {
        setVaultState('locked');
        setShowUnlock(false);
        setDocuments([]);
    };

    const handleLock = async() => {
        try {
            await api.post('/vault/lock');
        } catch (error) {
        }
        handleVaultLocked();
    };

    const handleLogout = async() => {
        try {
            await api.post('/vault/lock');
        } catch (error) {
        }
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        const init = async() => {
            try {
                const userRes = await api.get('/auth/me');
                setUser(userRes.data.data);

                const statusRes = await api.get('/vault/status');
                const { isSetup, isUnlocked } = statusRes.data.data;

                if (!isSetup) {
                    setVaultState('setup');
                } else if (!isUnlocked) {
                    setVaultState('locked');
                } else {
                    setVaultState('unlocked');
                    fetchDocuments();
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Unable to load dashboard');
            }
        };
        init();
    }, []);

    if(error) {
        return <p>{error}</p>
    }
    if(!user || !vaultState) {
        return <p>Loading...</p>
    }

    return (
        <>
            <h2>{user.name}</h2>
            <h2>{user.email}</h2>
            <button onClick = {handleLogout}>Logout</button>

            <TwoFactorSettings enabled = {user.twoFactorEnabled} onChanged = {fetchUser} />

            {vaultState === 'setup' && (
                <VaultSetup onDone = {handleVaultReady} />
            )}

            {vaultState === 'locked' && (
                <>
                    <h3>Your vault is locked</h3>
                    {showUnlock ? (
                        <VaultUnlock
                            onDone = {handleVaultReady}
                            onCancel = {() => setShowUnlock(false)}
                        />
                    ) : (
                        <button onClick = {() => setShowUnlock(true)}>Unlock Vault</button>
                    )}
                </>
            )}

            {vaultState === 'unlocked' && (
                <>
                    <h3>My Vault</h3>
                    <button onClick = {handleLock}>Lock Vault</button>

                    <UploadForm
                        onUploaded = {fetchDocuments}
                        onVaultLocked = {handleVaultLocked}
                    />

                    {docError && <p>{docError}</p>}
                    <DocumentList
                        documents = {documents}
                        onDeleted = {fetchDocuments}
                        onVaultLocked = {handleVaultLocked}
                    />
                </>
            )}
        </>
    );
}

export default Dashboard;