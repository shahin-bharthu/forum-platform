import { RouterProvider } from "react-router-dom";

import "./App.css";
import router from './routes.jsx'
import CircularSpinner from "./components/CircularSpinner.jsx";
import PositionedSnackbar from "./components/SnackBar.jsx";
function App() {
  return (
    <>
    {/* <CircularSpinner/> */}
    <RouterProvider router={router}></RouterProvider>
    <PositionedSnackbar/>
    </>
  );
}

export default App;