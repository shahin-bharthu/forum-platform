import { Navigate, useRouteLoaderData } from "react-router-dom";

const ErrorPage = () => {
    const token = useRouteLoaderData('root');
    return (
        <>
            {token && <Navigate to="/user/dashboard" />}
            {!token && <Navigate to="/login/201" />}
        </>
    )
}

export default ErrorPage;