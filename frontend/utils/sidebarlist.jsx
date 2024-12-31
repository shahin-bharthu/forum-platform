import ForumIcon from '@mui/icons-material/Forum';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import SignpostIcon from '@mui/icons-material/Signpost';
import AllInboxRoundedIcon from '@mui/icons-material/AllInboxRounded';
const menuList=[
    { text: 'Home', icon: <HomeIcon />, path: '/user/dashboard' },
    { text: 'My Posts', icon: <AllInboxRoundedIcon />, path: '/post/my-posts' },
    { text: 'My Forums', icon: <SignpostIcon />, path: '/user/my-forums' },
    { text: 'All Forums', icon: <ForumIcon />, path: '/user/forums' },
    { text: 'Logout', icon: <LogoutIcon />, path: 'logout' },
]

export default menuList;