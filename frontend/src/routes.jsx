import { createBrowserRouter, Navigate } from "react-router-dom";

import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import AuthPage from "./pages/AuthPage";
import UserProfilePage from "./pages/UserProfilePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
    children: [
      { index: true, element: <Navigate to="/signup" replace /> },
      { path: "signup", element: <SignupPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "user-profile", element: <UserProfilePage /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> }
    ],
  },
]);

export default router;
