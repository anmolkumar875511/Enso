import { useState, useEffect } from 'react';
import api from '../api/axios.js';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const token = localStorage.getItem('token');
                const header = {headers: {Authorization: `Bearer ${token}`}};
                const res = await api.get('/auth/me', header);
                setUser(res.data.data)
            } catch (error) {
                setError(error.response?.data?.message || 'Unable to fetch user details');
            }
        };
        fetchUser();
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
        </>
    );
}

export default Dashboard;