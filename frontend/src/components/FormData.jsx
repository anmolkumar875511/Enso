import { useState } from 'react';
import api from '../api/axios.js';
import { CATEGORIES } from '../constants/categories.js';

function uploadForm({ onUploaded }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if(!file) {
            setError('Please choose a file');
            return;
        }

        const formData = new FormData();
        if(title.trim()) {
            formData.append('title', title.trim());
        }
        formData.append('category', category);
        formData.append('notes', notes);
        formData.append('file', file);

        try {
            setLoading(true);
            await api.post('/documents/create', formData);

            setTitle('');
            setCategory(CATEGORIES[0]);
            setNotes('');
            setFile(null);
            e.target.reset();

            onUploaded();
        } catch (error) {
            setError(error.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return(
        <>
            <h3>Upload Documents</h3>
            <form onSubmit = { handleSubmit }>
                <input
                    placeholder = 'Title'
                    value = {title}
                    onChange = {(e) => setTitle(e.target.value)}
                />
                <select
                    value = {category}
                    onChange = {(e) => setCategory(e.target.value)}
                >
                    {CATEGORIES.map((c) => (
                        <option key = {c} value = {c}>{c}</option>
                    ))}
                </select>
                <input
                    placeholder = 'Notes'
                    value = {notes}
                    onChange = {(e) => setNotes(e.target.value)}
                />
                <input
                    type = 'file'
                    accept = '.png, .jpeg, .jpg, .webp, .pdf'
                    onChange = {(e) => setFile(e.target.files[0])}
                />
                <button type = 'submit' disabled = {loading}>
                    {loading? "Uploading..." : "Upload"}
                </button>
            </form>
            {error && <p>{error}</p>}
        </>
    );
}

export default uploadForm;