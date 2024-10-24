import { Navigate, useRouteLoaderData } from "react-router-dom";
import LoginForm from "../components/LoginForm";

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