import { RouterProvider } from "react-router-dom";
import { createTheme } from '@mui/material/styles';
import "./App.css";
import router from './routes.jsx'
import PositionedSnackbar from "./components/SnackBar.jsx";
import { ThemeProvider } from "@emotion/react";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#27213c',
//       light: '#a6a57a',
//       // dark: '#a99f96',
//       contrastText: '#FFFFFF'
//     },
//     secondary: {
//       main: '#5a352a',
//       // light: '#dda77b',
//       dark: '#a33b20',
//       contrastText: '#FFFFFF',
//     },
//     // action: {
//     //   selected: '#71677c', // Based on primary.light
//     //   selectedOpacity: '0.7',
//     //   hover: '#3e3454', // Slightly lighter than primary.main
//     //   hoverOpacity: '0.7'
//     // }
//   },
// });


// const theme = createTheme({
//   palette: {
//     primary: {
//       light: '#673f41',
//       main: '#3c1518',
//       dark: '#1a0000',
//       contrastText: '#ffffff',
//     },
//     secondary: {
//       light: '#d66b2b',
//       main: '#a44200',
//       dark: '#732500',
//       contrastText: '#ffffff',
//     },
//     success: {
//       light: '#68d391',
//       main: '#38a169',
//       dark: '#276749',
//       contrastText: '#ffffff',
//     },
//     warning: {
//       light: '#f6ad55',
//       main: '#dd6b20',
//       dark: '#c05621',
//       contrastText: '#ffffff',
//     },
//     error: {
//       light: '#fc8181',
//       main: '#e53e3e',
//       dark: '#9b2c2c',
//       contrastText: '#ffffff',
//     },
//     background: {
//       default: '#fdfaf6', // warm off-white
//       paper: '#fffaf0',   // light parchment tone
//     },
//     text: {
//       primary: '#2d2d2d',
//       secondary: '#5e5e5e',
//     },
//   },
// });



// BURGUNDY AND YELLOW
// const theme = createTheme({
//   palette: {
//     primary: {
//       light: '#9d5d39',     // your light
//       main: '#6d352a',      // your primary
//       dark: '#3c1518',      // your dark
//       contrastText: '#ffffff',
//     },
//     secondary: {
//       light: '#f9f871',     // your light
//       main: '#e5bf56',      // your secondary
//       dark: '#c68b45',      // your dark
//       contrastText: '#3c1518',
//     },
//     success: {
//       light: '#c6e3c0',
//       main: '#81c784',
//       dark: '#388e3c',
//       contrastText: '#ffffff',
//     },
//     warning: {
//       light: '#ffe08a',
//       main: '#fbc02d',
//       dark: '#c49000',
//       contrastText: '#3c1518',
//     },
//     error: {
//       light: '#ffb3b3',
//       main: '#e53935',
//       dark: '#a02725',
//       contrastText: '#ffffff',
//     },
//     background: {
//       default: '#fdf8f2', // warm parchment-like
//       paper: '#fffdf7',   // slightly brighter for cards/panels
//     },
//     text: {
//       primary: '#2e1d17',  // grounded, warm dark brown
//       secondary: '#5c463f',
//     }
//   },
// });


// BURGUNDY AND LAVENDER
// const theme = createTheme({
//   palette: {
//     primary: {
//       light: '#673f41',     // lighter red-brown
//       main: '#3c1518',      // deep primary
//       dark: '#1a0000',      // even deeper
//       contrastText: '#ffffff',
//     },
//     secondary: {
//       light: '#a18a89',     // softened taupe
//       main: '#897171',      // dusty mauve-gray
//       dark: '#6e5a5a',      // deeper muted tone
//       contrastText: '#ffffff',
//     },
//     success: {
//       light: '#c8e6c9',
//       main: '#81c784',
//       dark: '#388e3c',
//       contrastText: '#ffffff',
//     },
//     warning: {
//       light: '#fff3cd',
//       main: '#f4c430',  // a muted gold for warmth
//       dark: '#b8860b',
//       contrastText: '#3c1518',
//     },
//     error: {
//       light: '#ffcdd2',
//       main: '#e57373',
//       dark: '#b71c1c',
//       contrastText: '#ffffff',
//     },
//     background: {
//       default: '#f9f5f3',
//       paper: '#fffaf8',
//     },
//     text: {
//       primary: '#2f1f1f',
//       secondary: '#5e4b4b',
//     },
//   },
// });




// CHOCOLATE AND YELLOW (CREAM)
// const theme = createTheme({
//   palette: {
//     primary: {
//       light: '#9d5d39',     // lighter red-brown
//       main: '#6d352a',      // deep primary
//       dark: '#3c1518',      // even deeper
//       contrastText: '#ffffff',
//     },
//     secondary: {
//       light: '#f9f871',     // softened taupe
//       main: '#e5bf56',      // dusty mauve-gray
//       dark: '#c68b45',      // deeper muted tone
//       contrastText: '#ffffff',
//     },
//     success: {
//       light: '#c8e6c9',
//       main: '#81c784',
//       dark: '#388e3c',
//       contrastText: '#ffffff',
//     },
//     warning: {
//       light: '#fff3cd',
//       main: '#f4c430',  // a muted gold for warmth
//       dark: '#b8860b',
//       contrastText: '#3c1518',
//     },
//     error: {
//       light: '#ffcdd2',
//       main: '#e57373',
//       dark: '#b71c1c',
//       contrastText: '#ffffff',
//     },
//     background: {
//       default: '#f9f5f3',
//       paper: '#fffaf8',
//     },
//     text: {
//       primary: '#2f1f1f',
//       secondary: '#5e4b4b',
//     },
//   },
// });



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
      <RouterProvider router={router}></RouterProvider>
      <PositionedSnackbar/>
    </ThemeProvider>
  );
}

export default App;