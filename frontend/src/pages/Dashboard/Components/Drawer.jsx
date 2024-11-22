import { useCallback, useState, useEffect } from 'react';
import { Box, Drawer, CssBaseline, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import CombinedAppBar from './AppBar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import menuList from '../../../../utils/sidebarlist';
import { useNavigate, useLocation } from 'react-router-dom';
import deleteCookie from '../../../../utils/deleteCookie';
import axios from 'axios';

const drawerWidth = 200;

export default function ClippedDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false); 
  const [activeItem, setActiveItem] = useState(null); 
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenu = menuList.find(item => item.path === currentPath);
    if (activeMenu) {
      setActiveItem(activeMenu.path);
    }
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = useCallback(async () => {
    try {
      deleteCookie();
      const response = await axios.post("http://localhost:8080/auth/logout", {
        "Content-Type": "application/json",
        withCredentials: true
      });
      console.log(response);
      navigate('/login/201');
    } catch (error) {
      console.error("couldn't log user out", error);
    }
  }, []);

  const handleMenuItemClick = (path) => {
    if (path === 'logout') {
      handleLogout();
    } else {
      navigate(path);
      setActiveItem(path); 
    }
    setMobileOpen(false); 
  };

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