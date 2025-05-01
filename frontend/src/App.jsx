import { RouterProvider } from "react-router-dom";
import { createTheme } from '@mui/material/styles';
import "./App.css";
import router from "./routes.jsx";
import PositionedSnackbar from "./components/SnackBar.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@emotion/react";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      light: '#5C5F7A',
      main: '#333652',
      dark: '#1D1F2F',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#FFE670',
      main: '#FAD02C',       // muted rose
      dark: '#C8A400',       // deeper dusty red
      contrastText: '#000000',
    },
    error: {
      light: '#ffcdd2',
      main: '#e57373',
      dark: '#b71c1c',
      contrastText: '#ffffff',
    },
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}> 
      <RouterProvider router={router} />
      <PositionedSnackbar />
    </QueryClientProvider>
  </ThemeProvider>
  );
}

export default App;
