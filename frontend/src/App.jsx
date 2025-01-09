import { createBrowserRouter,RouterProvider, Navigate } from "react-router-dom";

import "./App.css";
import router from './routes.jsx'
import CircularSpinner from "./components/CircularSpinner.jsx";
function App() {
  return (
    <>
    {/* <CircularSpinner/> */}
    <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;