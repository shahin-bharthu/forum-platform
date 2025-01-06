import { createBrowserRouter, Navigate } from "react-router-dom";
import SignupPage from "./pages/Signup.jsx";
import LoginPage from "./pages/Login.jsx";
import { loader as loginLoader } from "./components/LoginForm.jsx"
import AuthPage from "./pages/AuthPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard, { dashboardLoader } from './pages/Dashboard/Index.jsx'
import { tokenLoader } from "../utils/auth.js";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import UserRootPage from "./pages/UserRootPage.jsx";
import MyForum, { forumLoader } from "./pages/MyForums/Index.jsx";
import AddForum, {forumDetailsLoader as forumDetails} from "./pages/AddForum/Index.jsx"
import AllForums, { allForumLoader } from "./pages/AllForums/Index.jsx";
import CreatePost, { topicDetailsLoader } from "./pages/CreatePost/Index.jsx";
import IntroDivider, { forumDetailsLoader } from "./pages/ForumDetails/Index.jsx";
import MyPosts from "./pages/MyPosts/Index.jsx";
import PostDetails, {postDetailsLoader} from "./pages/PostDetails/Index.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";


const GoogleWrapper = ({Outlet}) => {
  return (
  <GoogleOAuthProvider clientId="134528752542-asar3k7cmrjklpha94hno1q5ngt9s3no.apps.googleusercontent.com">
    {Outlet}
    {/* <LoginPage></LoginPage> */}
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
      { path: "dashboard",loader:dashboardLoader, element: <Dashboard /> },
      { path: "my-forums", id: "my-forums", loader: forumLoader, element: <MyForum /> },
      { path: "add-forum", element: <AddForum isEdit={false}/> },
      { path: "edit-forum/:forum_id", loader: forumDetails, element: <AddForum isEdit={true}/> },
      { path: "forums", loader: allForumLoader, element: <AllForums /> },
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
      { path: ":forum_id", loader:forumDetailsLoader, element: <IntroDivider/>  },
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
      { path: "edit/:id", loader: topicDetailsLoader, element: <CreatePost isEdit={true}/> },
      { path: ":id", loader: postDetailsLoader, element:<PostDetails/> }
    ],
  },
]);

export default router;
