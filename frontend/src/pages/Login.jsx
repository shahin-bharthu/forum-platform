import { useRouteLoaderData } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import Dashboard from '../pages/Dashboard/Index';

const LoginPage = () => {
    const token = useRouteLoaderData('root');
    return (
        <>
            {token && <Dashboard />}
            {!token && <LoginForm/>}
        </>
    )
}

export default LoginPage;