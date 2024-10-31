import { Navigate, useRouteLoaderData } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { getAuthToken } from "../../utils/auth.js";

const LoginPage = () => {
    const token = useRouteLoaderData('root');
    return (
        <>
            {token && <Navigate to="/user/dashboard" />}
            {!token && <LoginForm/>}
        </>
    )
}

export default LoginPage;