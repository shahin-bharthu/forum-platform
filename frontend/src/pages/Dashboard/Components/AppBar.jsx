import { useState, useCallback, memo, useEffect } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, MenuItem, Menu, Avatar, styled, alpha, InputBase } from '@mui/material';
import { Menu as MenuIcon, Add as AddIcon, MoreVert as MoreIcon, AutoStories, Search as SearchIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../../utils/axiosInstance.js';
import { Grid2 as Grid, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import Popover from '@mui/material/Popover';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

function CombinedAppBar({ handleDrawerToggle }) {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [searchResults, setSearchResults] = useState([{ name: 'No results found', purpose: 'Try searching for something else' }]);  
  const navigate = useNavigate();
  const { userName, profilePhoto } = useSelector((state) => state.user);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [anchorEl, setAnchorEl] = useState(null);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    console.log('searchResults', searchResults);
  }, [searchResults]);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMoreAnchorEl(null);
  }, []);

  const handleCreatePost = useCallback(() => {
    handleMobileMenuClose();
    navigate('/user/create-post', { state: { forumName: null, forumId: null } })
  }, [handleMobileMenuClose, navigate]);

  const handleMobileMenuOpen = useCallback((event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  }, []);

  const handleEditProfile = useCallback(() => {
    handleMobileMenuClose();
    navigate('/user/profile');
  }, [navigate, handleMobileMenuClose])

  const handleSearchForums = async (e, searchText) => {
    e.preventDefault();
    const searchQuery = searchText.trim();
    if (searchQuery) {
      const searchResult = await axiosInstance.get(`/forum/search/${searchQuery}`);
      console.log(searchResult.data);
      setSearchResults(searchResult.data.data);
    }
  }

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleCreatePost}>
        <IconButton size="large" color="inherit" >
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
        <Avatar src={profilePhoto}
          sx={{ width: 30, height: 30, mx: 1 }} />
        <Typography sx={{ textAlign: 'center', m: 1 }}> Hi, {userName}</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <>
    
      {searchResults.length >= 0 && 
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{ maxWidth:845 , maxHeight: 500}}
      >
        <Grid container spacing={2} sx={{ mx:3 , my: 2}}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ mt: 1, mb: 2 }} variant="h6" component="div">
              Search Results
            </Typography>
            <List dense={true}>
              {searchResults.length >= 1 ? searchResults.map((result, index) => (
                // <ListItem key={index} button component={Link} to={`/forum/${result.id}`}>
                <ListItem key={index} button>
                  <ListItemAvatar>
                    <Avatar>{result.name.charAt(0).toUpperCase() || 'X'}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={result.name} secondary={result.purpose || "No description"} />
                </ListItem>
              )) : <ListItem button>
              <ListItemAvatar>
                <Avatar>{searchResults.name.charAt(0).toUpperCase() || 'X'}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={searchResults.name} secondary={searchResults.purpose || "No description"} />
            </ListItem>}
            </List>
          </Grid>
        </Grid>
      </Popover> }

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 0, display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <AutoStories sx={{ display: 'flex', mr: 2 }} />
          <Tooltip title="Go to Home Page" placement="right" arrow>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="dashboard"
              sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', textDecoration: 'none', color: 'inherit' }}
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
                if (event.key === 'Enter') {
                  handleSearchForums(event, event.target.value);
                  setAnchorEl(event.currentTarget);
                }
              }}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Create Post" arrow>
              <Button onClick={handleCreatePost} variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 28 }} disableElevation>
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
                <Avatar src={profilePhoto}
                  sx={{ width: 30, height: 30, mx: 1 }} />
                Hi, {userName}
              </Button>
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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