import { useState } from 'react';
import api from '../api/axios';
import { CATEGORIES } from '../constants/categories';

function DocumentList({ documents, onDeleted}) {
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');

    const handleDelete = async (id) => {
        const confirm = window.confirm('Delete this document?');
        if(!confirm) {
            return;
        }

        setError('');
        try {
            await api.delete('/documents/del', { data: {id}});
            onDeleted();
        }
        catch (error) {
            setError(error.response?.data?.message || 'Delete failed');
        }
    };

    const visibleDocuments = 
        filter === 'all'
        ? documents
        : documents.filter((doc) => {doc.filter === filter});

    return (
        <>
            <h3>My Dcouments</h3>
            <select value = {value} onChange = {(e) => setFilter(e.target.value)}>
                <option value = 'all'>all</option>
                {CATEGORIES.map((e) => (
                    <option key = {c} value = {c}>{c}</option>
                ))};
            </select>
            {error && <p>{error}</p>}

            {visibleDocuments.length === 0 ? (
                <p>No Documents</p>
            ) : (
                <ul>
                    {visibleDocuments.map((doc) => (
                        <li key = {doc._id}>
                            <strong>{doc.title}</strong> | {doc.category} | {' '}
                            {doc.notes}
                            {new Date(doc.uploadDate).toLocaleDateString()}
                            <a href = {doc.fileUrl} target = '_blank' rel = 'noopener noreferrer'>
                                Open
                            </a>{' '}
                            <button onClick = {handleDelete(doc._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )};
        </>
    );
}

export default DocumentList;