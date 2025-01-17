import { createBrowserRouter, Navigate } from "react-router-dom";
import SignupPage from "./pages/Signup.jsx";
import LoginPage from "./pages/Login.jsx";
import { loader as loginLoader } from "./components/LoginForm.jsx"
import AuthPage from "./pages/AuthPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from './pages/Dashboard/Index.jsx'
import { tokenLoader } from "../utils/auth.js";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import UserRootPage from "./pages/UserRootPage.jsx";
import MyForum from "./pages/MyForums/Index.jsx"; // , { forumLoader }
import AddForum from "./pages/AddForum/Index.jsx"
import AllForums from "./pages/AllForums/Index.jsx";
import CreatePost from "./pages/CreatePost/Index.jsx";
import IntroDivider from "./pages/ForumDetails/Index.jsx";
import MyPosts from "./pages/MyPosts/Index.jsx";
import PostDetails from "./pages/PostDetails/Index.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";


const GoogleWrapper = ({Outlet}) => {
  return (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    {Outlet}
  </GoogleOAuthProvider>
  )
}
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
      { path: "signup", element: <GoogleWrapper Outlet={<SignupPage/>} /> },
      { path: "login/:status", loader: loginLoader, element: <GoogleWrapper Outlet={<LoginPage/>} /> },
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
      { path: "dashboard", element: <Dashboard /> },
      { path: "my-forums", id: "my-forums", element: <MyForum /> }, // loader: forumLoader
      { path: "add-forum", element: <AddForum isEdit={false}/> },
      { path: "edit-forum/:forum_id", element: <AddForum isEdit={true}/> },
      { path: "forums", element: <AllForums /> },
      { path: "create-post", element: <CreatePost isEdit={false} /> },
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
      { path: ":forum_id", element: <IntroDivider/>  },
    ],
  },
  {
    path: "/post",
    element: (
      <ProtectedRoute>
        <UserRootPage />
      </ProtectedRoute>
    ),
    loader: tokenLoader,
    errorElement: <ErrorPage />,
    id: "post",
    children: [
      { index: true, element: <Navigate to="/post/my-posts" /> },
      { path: "my-posts", element: <MyPosts/>  },
      { path: "edit/:id", element: <CreatePost isEdit={true}/> },
      { path: ":id", element:<PostDetails/> }
    ],
  },
]);

export default router;
