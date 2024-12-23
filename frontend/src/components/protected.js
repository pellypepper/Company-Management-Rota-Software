
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
 
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role.toLowerCase())) {

        const redirectPath = 
            user.role.toLowerCase() === 'hr' ? '/hrdash' :
            user.role.toLowerCase() === 'manager' ? '/managerdash' : 
            '/staffdash';
        
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;