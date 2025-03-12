import { RouterProvider } from "react-router-dom";

import "./App.css";
import router from './routes.jsx'
import PositionedSnackbar from "./components/SnackBar.jsx";

function App() {
  return (
    <>
    <RouterProvider router={router}></RouterProvider>
    <PositionedSnackbar/>
    </>
  );
}

export default App;