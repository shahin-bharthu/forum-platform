import { useCallback, useState, useEffect } from 'react';
import { Box, Drawer, CssBaseline, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, DialogTitle, Button } from '@mui/material';
import CombinedAppBar from './AppBar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import menuList from '../../../../utils/sidebarlist';
import { useNavigate, useLocation } from 'react-router-dom';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useDispatch } from 'react-redux';
import { clearUserProfile, setUserProfile } from '../../../store/slices/userSlice';
import axiosInstance from '../../../../utils/axiosInstance';

const drawerWidth = 200;

export default function ClippedDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

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
      
      const response = await axiosInstance.get(`/user/avatar/${currentUser.data.user.id}`,{responseType: "blob"});
      
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
  }, [dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (path) => {
      navigate(path);
      setActiveItem(path);
    setMobileOpen(false);
  };

  const handleHomeClickEvent = (event) => {
    setActiveItem(null);
  };

  useEffect(() => {
    const homeElement = document.getElementById('home'); // Assuming ComponentA has an id 'myButton'
    homeElement.addEventListener('homeClick', handleHomeClickEvent);
    return () => homeElement.removeEventListener('homeClick', handleHomeClickEvent);

  }, []);

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