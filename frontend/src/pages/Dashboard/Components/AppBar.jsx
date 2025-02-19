import { useState, useCallback, memo, useEffect } from "react";
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
  Stack,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  AutoStories,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";
import axiosInstance from "../../../../utils/axiosInstance.js";
import {
  Grid2 as Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "react-click-away-listener";

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
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [searchForumsResults, setSearchForumsResults] = useState([
    { name: "No results found", purpose: "Try searching for something else" },
  ]);
  const [searchTopicsResults, setSearchTopicsResults] = useState([
    { title: "No results found", content: "Try searching for something else" },
  ]);
  const [anchorEl, setAnchorEl] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const { userName, profilePhoto } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const open = Boolean(anchorEl);

  useEffect(() => {
    console.log("Search Results for Forums", searchForumsResults);
    console.log("Search Results for Posts", searchTopicsResults);
    console.log("Search Query", searchQuery);
  }, [searchForumsResults, searchTopicsResults, searchQuery]);

  const handleClickAway = () => {
    setAnchorEl(false);
  };

  const handleMobileMenuClose = useCallback(() => {
    setMobileMoreAnchorEl(null);
  }, []);

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
    navigate("/user/profile");
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
        setSearchForumsResults([{ name: "No results found", purpose: "Try searching for something else" }]);
      }
      if (searchResultTopics.data.data.length > 0) {
        setSearchTopicsResults(searchResultTopics.data.data);
      }
      else {
        setSearchTopicsResults([{ title: "No results found", content: "Try searching for something else" }]);
      }
    }
  };

  const handleAdvancedSearch = async (e, searchQuery, forums, posts) => {
    e.preventDefault();
    console.log("SEARCH QUERY:", searchQuery);
    console.log("FORUMS RESULT:", forums);
    console.log("POSTS RESULT:", posts);
    setAnchorEl(false);
    navigate(`/search/${searchQuery}`);
  }

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
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
      {/* <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
      <MenuItem onClick={handleEditProfile}>
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
          <AutoStories sx={{ display: "flex", mr: 2 }} />
          <Tooltip title="Go to Home Page" placement="right" arrow>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="dashboard"
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 2,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                textDecoration: "none",
                color: "inherit",
              }}
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
            <ClickAwayListener onClickAway={handleClickAway}>
              {searchForumsResults.length >= 0 && (
                <Popper
                  sx={{width: '35%', height:'75%', mx:50, zIndex: "3100", mt: 5, overflow: 'scroll', scrollbarColor: 'red', scrollbarWidth: 'thin'}}
                  open={open}
                  anchorEl={anchorEl}
                  placement={"bottom-start"}
                  keepMounted
                  transition
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper>
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
                                        sx={{cursor: 'pointer'}}
                                        onClick={(e) => {
                                          handleNavigateToForum(e, result)
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
                                      primary={searchForumsResults.name}
                                      secondary={
                                        searchForumsResults.purpose ||
                                        "No description"
                                      }
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
                                {searchTopicsResults.length >= 1 ? (
                                  searchTopicsResults.map((result, index) => (
                                    <ListItem key={index} button>
                                      <ListItemText 
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
                                      primary={searchTopicsResults.title}
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

            {/* <Tooltip title="Notifications" arrow>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            </Tooltip> */}
            <Tooltip title="Go to your profile" arrow>
              <Button
                variant="contained"
                sx={{ borderRadius: 28, pl: 1, pr: 2, mx: 1 }}
                size="medium"
                aria-label="account of current user"
                aria-controls={menuId}
                onClick={handleEditProfile}
                disableElevation
              >
                <Avatar
                  src={profilePhoto}
                  sx={{ width: 30, height: 30, mx: 1 }}
                />
                Hi, {userName}
              </Button>
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
      {/* {renderMenu} */}
    </>
  );
}

export default memo(CombinedAppBar);