import React from 'react'
import { getAuthToken } from './auth.js';
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const token = getAuthToken();
    if(!token) {
        return <Navigate to="/login/201" replace></Navigate>
    }
 return children
};

export default ProtectedRoute;
