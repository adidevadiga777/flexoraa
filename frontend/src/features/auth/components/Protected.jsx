import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from 'react-router';
import LoadingScreen from "../../../components/LoadingScreen";

const Protected = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) {
        return <LoadingScreen />
    }
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children;
}

export default Protected