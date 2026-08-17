import React from 'react';
import {Navigate, Outlet} from 'react-router-dom'
import {useAuthStore} from '../store/useAuthStore';

export const ProtectedRoute = ({allowedRoles})=>{
    const {user, isAuthenticated} = useAuthStore();

    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }

    if(allowedRoles && !allowedRoles.includes(user?.role)){
        return <Navigate to="/browse" replace />;
    }

    return <Outlet />
}