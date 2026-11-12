import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';

function Login() {
    const [formData, setFormData] = useState({email: '', password: ''});
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(searchParams.get('error') || '');
    const [tempToken, setTempToken] = useState(searchParams.get('tempToken') || '');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get('tempToken')) {
            navigate('/login', { replace: true });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const res = await api.post('/auth/login', formData);
            const data = res.data.data;

            if (data.requires2FA) {
                setTempToken(data.tempToken);
                return;
            }

            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Login Failed');
        } finally {
            setLoading(false);
        }
    }

    const handleCodeSubmit = async(e) => {
        e.preventDefault();
        setError('');

        if (!code.trim()) {
            setError('Please enter your code');
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/auth/2fa/verify', { tempToken, code });
            localStorage.setItem('token', res.data.data.token);
            navigate('/dashboard');
        } catch (error) {
            const message = error.response?.data?.message || 'Verification failed';
            setError(message);

            if (error.response?.status === 401 && message.includes('expired')) {
                setTempToken('');
                setCode('');
            }
        } finally {
            setLoading(false);
        }
    }

    if (tempToken) {
        return (
            <>
                <h2>Two-factor authentication</h2>
                <p>Enter the 6-digit code from your authenticator app, or a backup code.</p>
                <form onSubmit = {handleCodeSubmit}>
                    <input
                        placeholder = 'Code'
                        value = {code}
                        onChange = {(e) => setCode(e.target.value)}
                        autoFocus
                        autoComplete = 'one-time-code'
                    />
                    <button type = 'submit' disabled = {loading}>
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
                <button onClick = {() => { setTempToken(''); setCode(''); setError(''); }}>
                    Back to login
                </button>
                {error && <p>{error}</p>}
            </>
        );
    }

    return (
        <>
            <h2>Login</h2>
            <form onSubmit = {handleSubmit}>
                <input name = 'email' placeholder = 'Email' value = {formData.email} onChange = {handleChange} />
                <input name = 'password' type = 'password' placeholder = 'Password' value = {formData.password} onChange = {handleChange} />
                <button type = 'submit' disabled = {loading}>Login</button>
                {error && <p>{error}</p>}
            </form>
            <a href = 'http://localhost:5000/api/v1/auth/google'>Continue with Google</a>
        </>
    );
}

export default Login;