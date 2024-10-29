import ForumIcon from '@mui/icons-material/Forum';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import SignpostIcon from '@mui/icons-material/Signpost';
const menuList=[
    { text: 'Home', icon: <HomeIcon />, path: 'dashboard' },
    { text: 'My Posts', icon: <ForumIcon />, path: 'myPosts' },
    { text: 'My Forums', icon: <SignpostIcon />, path: 'my-forums' },
    { text: 'Messages', icon: <MarkAsUnreadIcon />, path: 'messages' },
    { text: 'All Forums', icon: <ForumIcon />, path: 'forums' },
    { text: 'Logout', icon: <LogoutIcon />, path: 'logout' },
]

export default menuList;