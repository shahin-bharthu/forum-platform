import { createBrowserRouter, Navigate } from "react-router-dom";

import SignupPage from "./pages/Signup.jsx";
import LoginPage from "./pages/Login.jsx";
import {loader as loginLoader} from "./components/LoginForm.jsx"
import AuthPage from "./pages/AuthPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Index from './pages/Dashboard/Index.jsx'
import { tokenLoader } from "../utils/auth.js";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
    loader: tokenLoader,
    id: "root",
    children: [
      // { index: true, element: <Navigate to="/login" replace /> },
      { index: true, element: (<ProtectedRoute><Index /></ProtectedRoute>) },
      { path: "signup", element: <SignupPage /> },
      { path: "login/:status", loader: loginLoader, element: <LoginPage /> },
      { path: "user-profile", element: (<ProtectedRoute><UserProfilePage /></ProtectedRoute>)},
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "dashboard", element: (<ProtectedRoute><Index /></ProtectedRoute>) }
    ],
  },
]);

export default router;
