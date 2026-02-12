import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminRoute Component
 * 
 * Protects routes that should only be accessible by admin users.
 * 
 * - If not authenticated → redirect to login
 * - If authenticated but not admin → redirect to dashboard
 * - If authenticated and admin → render children
 */
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    // Not logged in → go to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in but not admin → go to dashboard
    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // Admin user → render protected content
    return <>{children}</>;
};

export default AdminRoute;
