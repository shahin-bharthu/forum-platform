import { createBrowserRouter, Navigate } from "react-router-dom";

import SignupPage from "./pages/Signup.jsx";
import LoginPage from "./pages/Login.jsx";
import { loader as loginLoader } from "./components/LoginForm.jsx"
import AuthPage from "./pages/AuthPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Index from './pages/Dashboard/Index.jsx'
import { tokenLoader } from "../utils/auth.js";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import UserRootPage from "./pages/UserRootPage.jsx";
import MyForum, { forumLoader } from "./pages/MyForums/Index.jsx";
import AddForum from "./pages/AddForum/Index.jsx"
import AllForums, { allForumLoader } from "./pages/AllForums/Index.jsx";
import CreatePost from "./pages/CreatePost/Index.jsx";
import IntroDivider, {forumDetailsLoader} from "./pages/ForumDetails/Components/Details.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
    loader: tokenLoader,
    errorElement: <ErrorPage />,
    id: "root",
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Navigate to="/user/dashboard" />
          </ProtectedRoute>
        ),
      },
      { path: "signup", element: <SignupPage /> },
      { path: "login/:status", loader: loginLoader, element: <LoginPage /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <UserRootPage />
      </ProtectedRoute>
    ),
    loader: tokenLoader,
    errorElement: <ErrorPage />,
    id: "user",
    children: [
      { index: true, element: <Navigate to="/user/dashboard" /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "dashboard", element: <Index /> },
      { path: "my-forums", loader: forumLoader, element: <MyForum /> },
      { path: "add-forum", element: <AddForum /> },
      { path: "forums", loader: allForumLoader, element: <AllForums /> },
      { path: "create-post", element: <CreatePost /> },
    ],
  },
  {
    path: "/forum",
    element: (
      <ProtectedRoute>
        <UserRootPage />
      </ProtectedRoute>
    ),
    loader: tokenLoader,
    errorElement: <ErrorPage />,
    id: "forum",
    children: [
      { index: true, element: <Navigate to="/user/my-forums" /> },
      { path: ":forum_id", loader:forumDetailsLoader, element: <IntroDivider /> },
      // { path: "dashboard", element: <Index /> },
      // { path: "my-forums", loader: forumLoader, element: <MyForum /> },
      // { path: "add-forum", element: <AddForum /> },
      // { path: "forums", loader: allForumLoader, element: <AllForums /> },
      // { path: "create-post", element: <CreatePost /> },
    ],
  },
]);

export default router;
