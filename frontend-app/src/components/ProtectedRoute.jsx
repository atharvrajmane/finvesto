import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        // If no token, the user is not logged in. Redirect to the login page.
        return <Navigate to="/login" />;
    }
    // If there is a token, show the protected content.
    return children;
};

export default ProtectedRoute;