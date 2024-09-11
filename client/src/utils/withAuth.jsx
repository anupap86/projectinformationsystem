import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();
        const [cookies, setCookie, removeCookie] = useCookies(['token']);

        useEffect(() => {
            const checkToken = () => {
                const token = cookies.token;
                if (!token) {
                    navigate('/');
                    return;
                }

                try {
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        // Remove expired token and redirect to login
                        removeCookie('token');
                        navigate('/');
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    // Remove invalid token and redirect to login
                    removeCookie('token');
                    navigate('/');
                }
            };

            checkToken();
        }, [cookies, navigate, removeCookie]);

        return cookies.token ? <WrappedComponent {...props} /> : null;
    };
};

export default withAuth;
