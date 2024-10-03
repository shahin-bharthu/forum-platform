import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import AuthPage from "./pages/AuthPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthPage />,
      children: [
        {path:'signup' , element:<SignupPage /> },
        {path:'login' , element:<LoginPage/>  }
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
