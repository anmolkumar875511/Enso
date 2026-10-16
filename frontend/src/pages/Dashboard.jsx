import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import UploadForm from '../components/FormData.jsx';
import DocumentList from '../components/DocumentList.jsx';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [documents, setDcouments] = useState([]);
    const [error, setError] = useState('');
    const [docError, setDocError] = useState('');
    const navigate = useNavigate();

    const fetchDocuments = async() => {
        try {
            const res = await api.get('/documents/get');
            setDcouments(res.data.data);
        }
        catch (error) {
            setDocError(error.response?.data?.message || 'Unable to fetch documents');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', {replace: true});
    };

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data.data)
            } catch (error) {
                setError(error.response?.data?.message || 'Unable to fetch user details');
            }
        };
        fetchUser();
        fetchDocuments();
    }, []);

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
            <button onClick = {handleLogout}>Logout</button>

            <UploadForm onUploaded = {fetchDocuments} />

            {docError && <p>{docError}</p>}
            <DocumentList documents = {documents} onDeleted = {fetchDocuments} />
        </>
    );
}

export default Dashboard;