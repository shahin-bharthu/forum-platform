// import Box from '@mui/material/Box';
// import Snackbar from '@mui/material/Snackbar';
// import { useState } from 'react';
// import Slide from '@mui/material/Slide';
// import { blue } from '@mui/material/colors';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';

// export default function PositionedSnackbar({message}) {
//   const [state, setState] =useState({
//     open: true,
//     vertical: 'top',
//     horizontal: 'right',
//   });
//   const { vertical, horizontal, open } = state;

//   const handleClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }

//     setState({ ...state, open: false });;
//   };
//   function SlideTransition(props) {
//     return <Slide {...props} direction="down" />;
//   }
//   const action = (
//       <IconButton
//         size="small"
//         aria-label="close"
//         color="inherit"
//         onClick={handleClose}
//       >
//         <CloseIcon fontSize="small" />
//       </IconButton>
//   );
//   return (
//     <Box sx={{ width: 500 }}>

//       <Snackbar
//         anchorOrigin={{ vertical, horizontal }}
//         open={open}
//         TransitionComponent={SlideTransition}
//         autoHideDuration={5000}
//         onClose={handleClose}
//         message={message}
//         action={action}
//       />
//     </Box>
//   );
// }

import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Slide from '@mui/material/Slide';

const theme = createTheme({
    components: {
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#1976d2', // Primary blue color
                        color: '#ffffff',
                    },
                },
            },
        },
    },
});

export default function PositionedSnackbar({ message }) {
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    function SlideTransition(props) {
        return <Slide {...props} direction="down" />;
    }
    const action = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );

    return (
        <ThemeProvider theme={theme}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message={message}
                action={action}
                TransitionComponent={SlideTransition}
            />
        </ThemeProvider>
    );
}