import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

function Login() {
    const [formData, setFormData] = useState({email: '', password: ''});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');
        try {
            console.log(formData);
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.data);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Login Failed');
        }
    }

    return (
        <>
            <h2>Login</h2>
            <form onSubmit = {handleSubmit}>
                <input name = 'email' placeholder = 'Email' value = {formData.email} onChange = {handleChange} />
                <input name = 'password' type = 'password' placeholder = 'Password' value = {formData.password} onChange = {handleChange} />
                <button type = 'submit'>Login</button>
                {error && <p>{error}</p>}
            </form>
        </>
    );
}

export default Login;