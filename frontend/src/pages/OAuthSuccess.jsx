import useEffect from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function OAuthSuccess () {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if(token) {
            localStorage.setItem(token);
            navigate('/dashboard', {replace: true});
        }
        else {
            navigate(`/login?error=${encodeURIComponent('Google sign-in failed')}`, {replace: true});
        }
    }, [searchParams, navigate]);

    return <p>Signing you in...</p>
}

export default OAuthSuccess;