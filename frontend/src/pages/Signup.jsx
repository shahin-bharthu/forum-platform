import { Navigate } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";
import SignupForm from "../components/SignupForm";

const SignupPage = () => {
    const token = getAuthToken();

    return (
        <>
        {token && <Navigate to="/dashboard" />}
        {!token && <SignupForm/>}
        </>
    )
}

export default SignupPage;