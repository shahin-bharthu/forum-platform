import { createBrowserRouter,RouterProvider, Navigate } from "react-router-dom";

import "./App.css";
import router from './routes.jsx'
function App() {
  return (
    <>
    <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
