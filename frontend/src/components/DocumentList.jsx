import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { CATEGORIES } from '../constants/categories.js';

function DocumentList({ documents, onDeleted }) {
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');
    const [openingId, setOpeningId] = useState(null);
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        const confirm = window.confirm('Delete this document?');
        if(!confirm) {
            return;
        }

        try {
            await api.delete('/documents/del', { data: { id } });
            onDeleted();
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed');
        }
    };

    const getBlobErrorMessage = async (err) => {
        try {
            const text = await err.response.data.text();
            return JSON.parse(text).message;
        } catch {
            return null;
        }
    };

    const handleOpen = async (doc) => {
        setError('');
        setOpeningId(doc._id);

        const newTab = window.open('', '_blank');

        try {
            const res = await api.get(`/documents/${doc._id}/download`, {
                responseType: 'blob'
            });

            const blob = new Blob([res.data], { type: doc.mimeType });
            const url = URL.createObjectURL(blob);

            if (newTab) {
                newTab.location.href = url;
            } else {
                window.open(url, '_blank');
            }

            setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (err) {
            if (newTab) {
                newTab.close();
            }

            const message = await getBlobErrorMessage(err);

            if (err.response?.status === 403) {
                navigate('/vault', { replace: true });
                return;
            }

            setError(message || 'Unable to open document');
        } finally {
            setOpeningId(null);
        }
    };

    const visibleDocuments =
        filter === 'all'
            ? documents
            : documents.filter((doc) => doc.category === filter);

    return (
        <>
            <h3>My Documents</h3>

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">all</option>
                {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>

            {error && <p>{error}</p>}

            {visibleDocuments.length === 0 ? (
                <p>No documents found</p>
            ) : (
                <ul>
                    {visibleDocuments.map((doc) => (
                        <li key = {doc._id}>
                            <strong>{doc.title}</strong> | {doc.category} |{' '}
                            {new Date(doc.uploadDate).toLocaleDateString()}
                            {doc.notes && <p>{doc.notes}</p>}
                            <button
                                onClick = {() => handleOpen(doc)}
                                disabled = {openingId === doc._id}
                            >
                                {openingId === doc._id ? 'Opening...' : 'Open'}
                            </button>{' '}
                            <button onClick = {() => handleDelete(doc._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default DocumentList;