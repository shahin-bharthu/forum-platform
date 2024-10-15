import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import "./App.css";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import AuthPage from "./pages/AuthPage";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthPage />,
      children: [
        {index: true, element: <Navigate to="/signup" replace /> },
        {path:'signup' , element:<SignupPage /> },
        {path:'login' , element:<LoginPage/>  },
        {path:'user-profile', element: <UserProfilePage/> }
      ],
    },
  ]);
  return (
    <>
    <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
