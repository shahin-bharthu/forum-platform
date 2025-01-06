import React, { useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const createSnackbarTheme = (type) => createTheme({
    components: {
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: type === 'error'  
                            ? '#d32f2f'     // Red for error
                            : type === 'success' 
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
    // 
    type,
    autoHideDuration = 4000 
}) {
    const [open, setOpen] = useState(true);
    const theme = createSnackbarTheme(type);

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
