import { useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { useSelector } from 'react-redux';

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
    vertical = 'top', 
    horizontal = 'right',
    autoHideDuration = 4000,
    message,
    type
}) {
    const notification = useSelector(state=>state.ui.notification)

    const [open, setOpen] = useState(true);
    const theme = createSnackbarTheme(notification.type || type);
    

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

    if (!notification.message && message===undefined) return null;

    return (
        <ThemeProvider theme={theme}>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={autoHideDuration}
                onClose={handleClose}
                message={notification.message || message}
                action={action}
                TransitionComponent={(props) => <Slide {...props} direction="down" />}
            />
        </ThemeProvider>
    );
}