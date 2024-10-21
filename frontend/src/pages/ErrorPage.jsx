import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";

const ErrorPage = () => {
    const token = useRouteLoaderData('root');
    return (
        <>
            {token && <Navigate to="/dashboard" />}
            {!token && <LoginForm/>}
        </>
    )
}

export default ErrorPage;