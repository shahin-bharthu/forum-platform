import { useState, useCallback, memo } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu, Fab, Chip, Avatar } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon, AccountCircle, Notifications as NotificationsIcon, Add as AddIcon, MoreVert as MoreIcon, Adb as AdbIcon, AutoStories } from '@mui/icons-material';
import { Link, useNavigate, useRouteLoaderData } from 'react-router-dom';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

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

function CombinedAppBar({ currentUser, profilePhoto, handleDrawerToggle }) {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const navigate = useNavigate();

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMoreAnchorEl(null);
  }, []);

  const handleCreatePost = useCallback(() => {
    handleMobileMenuClose();
    navigate('/user/create-post', { state: { forumName: null, forumId: null } })
  }, [handleMobileMenuClose]);

  const handleMobileMenuOpen = useCallback((event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  }, []);

  const handleEditProfile = useCallback(() => {
    handleMobileMenuClose();
    navigate('/user/profile');
  }, [navigate, handleMobileMenuClose])


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
        <IconButton
          size="large"
          aria-controls="primary-search-account-menu"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
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
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Create Post" arrow>
              <Button onClick={handleCreatePost} variant="contained" startIcon={<AddIcon />} sx={{borderRadius: 28}} disableElevation>
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
              sx={{borderRadius: 28, pl: 1, pr: 2, mx: 1}}
              size="medium"
              aria-label="account of current user"
              aria-controls={menuId}
              onClick={handleEditProfile}
              disableElevation
              >
            <Avatar src={profilePhoto}
                    sx={{ width: 30, height: 30, mx: 1 }} />
              Hi, {currentUser}
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