import { getAuthToken } from "../../utils/auth";
import SignupForm from "../components/SignupForm";
import Dashboard  from "../pages/Dashboard/Index.jsx";

const SignupPage = () => {
    const token = getAuthToken();

    return (
        <>
        {token && <Dashboard />}
        {!token && <SignupForm/>}
        </>
    )
}

export default SignupPage;