import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Tooltip,
} from "@mui/material";
import CombinedAppBar from "./AppBar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import menuList from "../../../../utils/sidebarlist";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../../utils/axiosInstance";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { setUserProfile } from "../../../store/slices/userSlice";


const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  whiteSpace: "nowrap",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  whiteSpace: "nowrap",
});

export default function ClippedDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [miniOpen, setMiniOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const currentPath = location.pathname;
    const activeMenu = menuList.find((item) => item.path === currentPath);
    if (activeMenu) {
      setActiveItem(activeMenu.path);
    }

    async function getCurrentUser() {
      try {
        const currentUser = await axiosInstance.get("/user");

        const response = await axiosInstance.get(
          `/user/avatar/${currentUser.data.user.id}`,
          { responseType: "blob" }
        );

        if (response.data) {
          const reader = new FileReader();
          reader.onloadend = () => {
            dispatch(
              setUserProfile({
                userName: currentUser.data.user.username,
                profilePhoto: reader.result,
              })
            );
          };
          reader.readAsDataURL(response.data);
        }
      } catch (error) {
        console.error("Error fetching username or profile photo: ", error);
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
  const handleminimizeDrawer = () => {
    setMiniOpen(!miniOpen);
  };

  useEffect(() => {
    const homeElement = document.getElementById("home"); // Assuming ComponentA has an id 'myButton'
    homeElement.addEventListener("homeClick", handleHomeClickEvent);
    return () =>
      homeElement.removeEventListener("homeClick", handleHomeClickEvent);
  }, []);

  const drawer = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: "hidden" }}>
        <List>
          {menuList.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mx: 0.5 }}>
              <ListItemButton
                onClick={() => handleMenuItemClick(item.path)}
                sx={{
                  backgroundColor:
                    item.path === activeItem
                      ? theme.palette.action.selected
                      : "transparent",
                  "&:hover": {
                    backgroundColor:
                      item.path === activeItem
                        ? theme.palette.action.selected
                        : theme.palette.action.hover,
                  },
                }}
              >
                <Tooltip title={miniOpen ? item.text : null} placement="top">
                  <ListItemIcon sx={{ my: 0.5 }}>{item.icon}</ListItemIcon>
                </Tooltip>
                {<ListItemText primary={item.text} /> }
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );

  return (
    <>
      <Box component="nav" sx={{ display: "flex" }}>
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
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          // Drawer for larger screens
          <Drawer
            variant="permanent"
            sx={
              miniOpen
                ? {
                    width: 65,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                      ...closedMixin(theme),
                    },
                  }
                : {
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                      width: drawerWidth,
                      boxSizing: "border-box",
                      ...openedMixin(theme),
                    },
                  }
            }
          >
            {drawer}
            {/* <Divider
              sx={{
                position: "absolute",
                bottom: 70,
                left: 0,
                right: 0,
              }}
            /> */}
            <Button
              size="large"
              variant="standard"
              onClick={handleminimizeDrawer}
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p:2,
                borderRadius:0,
                marginLeft: "auto",
                marginRight: "auto",
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: "#ccc",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
              }}
            >
              <DoubleArrowIcon
                sx={{
                  transition: "transform 0.3s ease-in-out",
                  transform: !miniOpen ? "rotate(180deg)" : "rotate(360deg)",
                }}
              />
            </Button>
          </Drawer>
        )}
      </Box>
    </>
  );
}
