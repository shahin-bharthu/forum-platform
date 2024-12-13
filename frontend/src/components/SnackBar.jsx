import React, { useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const createSnackbarTheme = (isError,isSuccess) => createTheme({
    components: {
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: isError 
                            ? '#d32f2f'     // Red for error
                            : isSuccess 
                                ? '#2e7d32' // Green for success 
                                : '#1976d2',// Blue for default
                        color: '#ffffff',
                    },
                },
            },
        },
    },
});

export default function PositionedSnackbar({ 
    message, 
    vertical = 'top', 
    horizontal = 'right', 
    isError,
    isSuccess, 
    autoHideDuration = 4000 
}) {
    const [open, setOpen] = useState(true);
    const theme = createSnackbarTheme(isError, isSuccess);

    const handleClose = useCallback((event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    }, []);

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
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={autoHideDuration}
                onClose={handleClose}
                message={message}
                action={action}
                TransitionComponent={(props) => <Slide {...props} direction="down" />}
            />
        </ThemeProvider>
    );
}

// import React, { useState } from 'react';
// import Snackbar from '@mui/material/Snackbar';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import Slide from '@mui/material/Slide';

// const theme = createTheme({
//     components: {
//         MuiSnackbar: {
//             styleOverrides: {
//                 root: {
//                     '& .MuiSnackbarContent-root': {
//                         backgroundColor: '#1976d2', // Primary blue color
//                         color: '#ffffff',
//                     },
//                 },
//             },
//         },
//     },
// });

// export default function PositionedSnackbar({ message, vertical, horizontal }) {
//     const [open, setOpen] = useState(true);

//     const handleClose = (event, reason) => {
//         if (reason === 'clickaway') {
//             return;
//         }
//         setOpen(false);
//     };

//     function SlideTransition(props) {
//         return <Slide {...props} direction="down" />;
//     }
//     const action = (
//         <IconButton
//             size="small"
//             aria-label="close"
//             color="inherit"
//             onClick={handleClose}
//         >
//             <CloseIcon fontSize="small" />
//         </IconButton>
//     );

//     return (
//         <ThemeProvider theme={theme}>
//             <Snackbar
//                 anchorOrigin={{ vertical: "top", horizontal: "right" }}
//                 open={open}
//                 autoHideDuration={5000}
//                 onClose={handleClose}
//                 message={message}
//                 action={action}
//                 TransitionComponent={SlideTransition}
//             />
//         </ThemeProvider>
//     );
// }