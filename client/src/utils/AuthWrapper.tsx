import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../stateProviders/AuthStore';
import useChatStore from '../stateProviders/ChatStore';

const AuthWrapper = () => {
    const { currentUser, loading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/login'); // Redirect to login
        }
    }, [currentUser, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <Outlet />;
};

export default AuthWrapper;
