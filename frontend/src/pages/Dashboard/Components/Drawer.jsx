import { useCallback, useState, useEffect } from 'react';
import { Box, Drawer, CssBaseline, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, DialogTitle, Button } from '@mui/material';
import CombinedAppBar from './AppBar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import menuList from '../../../../utils/sidebarlist';
import { useNavigate, useLocation } from 'react-router-dom';
import deleteCookie from '../../../../utils/deleteCookie';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../../../store/userSlice';
import axiosInstance from '../../../../utils/axiosInstance';

const drawerWidth = 200;

export default function ClippedDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenu = menuList.find(item => item.path === currentPath);
    if (activeMenu) {
      setActiveItem(activeMenu.path);
    }

    async function getCurrentUser() {
      try {
      const currentUser = await axiosInstance.get('/user');

      const response = await axiosInstance.get(`/user/avatar/${currentUser.data.user.id}`,{responseType: "blob",})
      
      if (response.data) {
          const reader = new FileReader()
          reader.onloadend = () => {
            dispatch(setUserProfile({
              userName:currentUser.data.user.username,
              profilePhoto:reader.result
            }))
          }
          reader.readAsDataURL(response.data)
        }
      }
      catch (error) {
        console.error('Error fetching username or profile photo: ', error);
      }
    }

    getCurrentUser();
  }, [location.pathname,dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = useCallback(async () => {
    try {
      deleteCookie();
      setDialogOpen(false);
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error("couldn't log user out", error);
    }
  }, []);

  const handleMenuItemClick = (path) => {
    if (path === 'logout') {
      handleUpdateClick();
    } else {
      navigate(path);
      setActiveItem(path);
    }
    setMobileOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleUpdateClick = () => {
    setDialogOpen(true);
  };

  const logoutDialog = (
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogContent>
        <DialogTitle sx={{ px: 0 }}>
          Are you sure you want to log out?
        </DialogTitle>
        <DialogContentText>
          You&apos;ll need to sign back in to continue participating in discussions.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleLogout} color="primary">
          Yes, Log Out
        </Button>
      </DialogActions>
    </Dialog>
  )

  const drawer = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuList.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleMenuItemClick(item.path)}
                sx={{
                  backgroundColor: item.path === activeItem ? theme.palette.action.selected : 'transparent',
                  '&:hover': {
                    backgroundColor: item.path === activeItem ? theme.palette.action.selected : theme.palette.action.hover,
                  }
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {logoutDialog}
    </div>
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <CombinedAppBar handleDrawerToggle={handleDrawerToggle} />
        {/* Drawer for small screens */}
        {isSmallScreen ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          // Drawer for larger screens
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
    </>
  );
}