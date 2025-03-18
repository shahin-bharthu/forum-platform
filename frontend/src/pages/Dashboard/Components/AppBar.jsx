import { useState, useCallback, memo, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../utils/axiosInstance.js";
// Material UI components
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Avatar,
  styled,
  alpha,
  InputBase,
  DialogTitle,
  Button,
  Tooltip,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  Popper,
  Fade,
  Paper,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack
} from "@mui/material";
// Material UI icons
import {
  Menu as MenuIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  AutoStories,
  Search as SearchIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
// Redux actions
import { clearUserProfile } from "../../../store/slices/userSlice.js";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "40ch",
    },
  },
}));

function CombinedAppBar({ handleDrawerToggle }) {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const [searchForumsResults, setSearchForumsResults] = useState([
    { name: "No results found", purpose: "Try searching for something else" },
  ]);
  const [searchTopicsResults, setSearchTopicsResults] = useState([
    { title: "No results found", content: "Try searching for something else" },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const { userName, profilePhoto } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [anchorEl, setAnchorEl] = useState(null); //for search popper

  const open = Boolean(anchorEl); //for search popper
  const isMenuOpen = Boolean(menuAnchorEl);

  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const homeRef = useRef(null);

  const handleHomeClick = () => {
    const homeClickEvent = new CustomEvent('homeClick', { 
      bubbles: true,
    });
    homeRef.current.dispatchEvent(homeClickEvent);
  }

  const handleClickAway = () => {
    setAnchorEl(false);
  };

  const handleProfileMenuOpen = useCallback((event) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMoreAnchorEl(null);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
    handleMobileMenuClose();
  }, [handleMobileMenuClose]);

  const handleCreatePost = useCallback(() => {
    handleMobileMenuClose();
    navigate("/user/create-post", {
      state: { forumName: null, forumId: null },
    });
  }, [handleMobileMenuClose, navigate]);

  const handleMobileMenuOpen = useCallback((event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  }, []);

  const handleEditProfile = useCallback(() => {
    handleMobileMenuClose();
    handleMenuClose();
    navigate("/user/edit-profile");
  }, [navigate, handleMobileMenuClose]);

  const handleSearch = async (e, searchText) => {
    e.preventDefault();
    const searchQuery = searchText.trim();
    setSearchQuery(searchQuery);
    if (searchQuery) {
      const [searchResultForums, searchResultTopics] = await Promise.all([
        axiosInstance.get(`/forum/search/${searchQuery}`),
        axiosInstance.get(`/topic/search/${searchQuery}`),
      ]);
      if (searchResultForums.data.data.length > 0) {
        setSearchForumsResults(searchResultForums.data.data);
      }
      else {
        setSearchForumsResults([]);
      }
      if (searchResultTopics.data.data.length > 0) {
        setSearchTopicsResults(searchResultTopics.data.data);
      }
      else {
        setSearchTopicsResults([]);
      }
    }
    else {
      setSearchForumsResults([]);
      setSearchTopicsResults([]);
      setSearchQuery();
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      setDialogOpen(false);
      handleMenuClose();
      await axiosInstance.post("/auth/logout");
      // setTimeout(() => {
      navigate("/login/201", { replace: true });
      dispatch(clearUserProfile());
      // }, 1500);
    } catch (error) {
      console.error("couldn't log user out", error);
    }
  }, [dispatch, navigate]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    handleMenuClose();
  };

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
          You&apos;ll need to sign back in to continue participating in
          discussions.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="error">
          Cancel
        </Button>
        <Button type="button" onClick={handleLogout} color="primary">
          Yes, Log Out
        </Button>
      </DialogActions>
    </Dialog>
  );

  const handleAdvancedSearch = async (e, searchText, forums, posts) => {
    e.preventDefault();
    setAnchorEl(false);
    navigate(`/search/${searchText}`, { state: { forumResults: forums, postResults: posts }});
  }

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMenu = (
    <Menu
      anchorEl={menuAnchorEl}
      id={menuId}
      keepMounted
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleEditProfile}>
        <IconButton size="medium" color="inherit" sx={{ mr: 1 }}>
          <EditIcon />
        </IconButton>
        Edit Profile
      </MenuItem>

      <MenuItem onClick={handleUpdateClick}>
        <IconButton size="medium" color="inherit" sx={{ mr: 1 }}>
          <LogoutIcon />
        </IconButton>
        Logout
      </MenuItem>
      {logoutDialog}
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleCreatePost}>
        <IconButton size="large" color="inherit">
          <AddIcon />
        </IconButton>
        <p>Create Post</p>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <Avatar src={profilePhoto} sx={{ width: 30, height: 30, mx: 1 }} />
        <Typography sx={{ textAlign: "center", m: 1 }}>
          {" "}
          Hi, {userName}
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 0, display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton disableRipple onClick={() => navigate("/user/dashboard")} color="inherit"  >
            <AutoStories sx={{ display: "flex", mr: 2 }} />
          </IconButton>
          <Tooltip title="Go to Home Page" placement="right" arrow>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/user/dashboard"
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 2,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                textDecoration: "none",
                color: "inherit",
              }}
              ref={homeRef}
              onClick={handleHomeClick}
              id = "home"
            >
              BookNook
            </Typography>
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch(event, event.target.value);
                  setAnchorEl(true);
                }
              }}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />

            {searchQuery && 
              <ClickAwayListener onClickAway={handleClickAway}>
                {searchForumsResults.length >= 0 && (
                  <Popper
                    sx={{
                      width: "30%",
                      height: "75%",
                      mx: 53,
                      zIndex: "1300",
                      mt: 5,
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    placement={"bottom-start"}
                    keepMounted
                    transition
                  >
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={350}>
                        <Paper
                          sx={{
                            mt: 1.4,
                            p: 1.5,
                            width: "100%",
                            maxHeight: "100%",
                            overflow: "scroll",
                            "&::-webkit-scrollbar": {
                              display: "none",
                            },
                          }}
                        >
                          <Grid container spacing={2} sx={{ mx: 3, my: 2 }} >
                            <Stack>
                              <Grid item xs={12} md={6}>
                                <Typography
                                  sx={{ mt: 1 }}
                                  variant="subtitle1"
                                  component="div"
                                >
                                  Forums
                                </Typography>
                                <List dense={true}>
                                  {searchForumsResults.length >= 1 ? (
                                    searchForumsResults.map((result, index) => (
                                      <ListItem key={index} button>
                                        <ListItemText
                                          sx={{cursor: 'pointer', wordBreak: 'break-word'}}
                                          onClick={(e) => {
                                            setAnchorEl(false);
                                            if (result.id) {
                                              navigate(`/forum/${result.name.replace(/\s+/g, '_').toLowerCase()}`)
                                            }
                                          }}
                                          primary={result.name}
                                          secondary={
                                            result.purpose || "No description"
                                          }
                                        />
                                      </ListItem>
                                    ))
                                  ) : (
                                    <ListItem button>
                                      <ListItemText
                                        primary="No results found"
                                        secondary="Try searching for something else"
                                      />
                                    </ListItem>
                                  )}
                                </List>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography
                                  sx={{ mt: 1}}
                                  variant="subtitle1"
                                  component="div"
                                >
                                  Posts
                                </Typography>
                                <List dense={true}>
                                  {/* {console.log(searchTopicsResults)} */}
                                  {searchTopicsResults.length >= 1 ? (
                                    searchTopicsResults.map((result, index) => (
                                      <ListItem key={index} button>
                                        <ListItemText 
                                          sx={{cursor: 'pointer', wordBreak: 'break-word'}}
                                          onClick={() => {
                                            setAnchorEl(false);
                                            if (result.id) {
                                              navigate(`/post/${result.id}`)
                                            }
                                          }} 
                                          primary={result.title} />
                                      </ListItem>
                                    ))
                                  ) : (
                                    <ListItem button>
                                      <ListItemText
                                        primary="No results found"
                                      />
                                    </ListItem>
                                  )}
                                </List>
                              </Grid>
                                <Box textAlign='end' marginBottom={1}>
                                  <Button color="black" size="small" onClick={(event) => handleAdvancedSearch(event, searchQuery, searchForumsResults, searchTopicsResults)}>
                                    See more results...
                                  </Button>
                                </Box>
                            </Stack>
                          </Grid>
                        </Paper>
                      </Fade>
                    )}
                  </Popper>
                )}
              </ClickAwayListener>
            }
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Tooltip title="Create Post" arrow>
              <Button
                onClick={handleCreatePost}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ borderRadius: 28 }}
                disableElevation
              >
                Create
              </Button>
            </Tooltip>

            <Tooltip
              title={
                <Typography
                  variant="button"
                  sx={{ fontSize: "0.75rem", fontWeight: "bold", color: "white" }}
                >{userName}</Typography>
              }
              arrow
            >
              <IconButton
                aria-label="profile menu"
                size="small"
                onClick={handleProfileMenuOpen}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // Optional: add a white background on hover
                  },
                  "& .MuiTouchRipple-root": {
                    color: "white", // Set the ripple color to white
                  },
                }}
              >
                <Avatar src={profilePhoto} sx={{ width: 30, height: 30 }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
}

export default memo(CombinedAppBar);
