import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import UploadForm from '../components/FormData.jsx';
import DocumentList from '../components/DocumentList.jsx';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState('');
    const [docError, setDocError] = useState('');
    const navigate = useNavigate();

    const fetchDocuments = async() => {
        try {
            const res = await api.get('/documents/get');
            setDocuments(res.data.data);
        }
        catch (error) {
            setDocError(error.response?.data?.message || 'Unable to fetch documents');
        }
    };

    const handleLogout = async() => {
        try {
            await api.post('/vault/lock');
        } catch (error) {
        }
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    const handleLock = async() => {
        try {
            await api.post('/vault/lock');
        } catch (error) {
        }
        navigate('/vault', { replace: true });
    };

    useEffect(() => {
        const init = async() => {
            try {
                const statusRes = await api.get('/vault/status');
                if (!statusRes.data.data.isUnlocked) {
                    navigate('/vault', { replace: true });
                    return;
                }

                const res = await api.get('/auth/me');
                setUser(res.data.data);
                await fetchDocuments();
            } catch (error) {
                setError(error.response?.data?.message || 'Unable to load dashboard');
            }
        };
        init();
    }, [navigate]);

    if(error) {
        return <p>{error}</p>
    }
    if(!user) {
        return <p>Loading...</p>
    }

    return (
        <>
            <h2>{user.name}</h2>
            <h2>{user.email}</h2>
            <button onClick = {handleLock}>Lock Vault</button>{' '}
            <button onClick = {handleLogout}>Logout</button>

            <UploadForm onUploaded = {fetchDocuments} />

            {docError && <p>{docError}</p>}
            <DocumentList documents = {documents} onDeleted = {fetchDocuments} />
        </>
    );
}

export default Dashboard;