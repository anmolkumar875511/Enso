import { useState } from 'react';
import api from '../api/axios.js';
import { CATEGORIES } from '../constants/categories.js';

function DocumentList({ documents, onDeleted }) {
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');

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
                            <a href = {doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                Open
                            </a>{' '}
                            <button onClick = {() => handleDelete(doc._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default DocumentList;