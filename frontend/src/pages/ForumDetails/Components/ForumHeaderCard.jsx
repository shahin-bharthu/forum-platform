import { useEffect, useState } from 'react';
import { 
  Card, 
  CardActions, 
  CardContent, 
  CardMedia, 
  Button, 
  Typography, 
  Avatar, 
  Stack, 
  Tooltip, 
  useMediaQuery, 
  useTheme,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PositionedSnackbar from '../../../components/SnackBar';

export default function ForumHeaderCard({ forum, setIsSubbed }) {
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState();
  const [banner, setBanner] = useState();
  const [bannerUrl, setBannerUrl] = useState();
  
  useEffect(() => {
    async function isSubscribed(forum) {
      const isUserSubscribed = await axios.get(`http://localhost:8080/forum/is-subscribed/${forum.id}`, {
        withCredentials: true,
      });
      setSubscribed(isUserSubscribed.data.isSubscribed);
      setIsSubbed(isUserSubscribed.data.isSubscribed)
    }

    const fetchAvatar = async () => {
      const data = await handleFileRead();
    };

    fetchAvatar().catch(console.error);
    isSubscribed(forum);
  }, []);

  const handleFileRead = async () => {
    const file = await axios.get(`http://localhost:8080/forum/banner/${forum.id}`, {
      withCredentials: true,
      responseType: "blob",
    });

    if (file.data) {
      setBanner(file.data);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result);
      };
      reader.readAsDataURL(file.data);
    }
  };


  const handleSubscribe = async (event, forumId) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/forum/subscribe/${forumId}`,
        null,
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );

      setMessage(`Subscribed to ${response.data.data.name}`);

      setTimeout(() => {
        setMessage(null);
        setSubscribed(true)
        setIsSubbed(true)
      }, 1000);


    } catch (error) {
      console.error("Error: ", error);
      return {
        allForums: [],
        subscribableForums: [],
        empty: true,
      };
    }
  };


  const handleUnSubscribe = async (event, forumId) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/forum/unsubscribe/${forumId}`,
        null,
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );

      setMessage(`Unsubscribed from ${response.data.data.name}`);

      setTimeout(() => {
        setMessage(null);
        setSubscribed(false);
        setIsSubbed(false)
      }, 1000);

    } catch (error) {
      console.error("Error: ", error);
      return {
        allForums: [],
        subscribableForums: [],
        empty: true,
      };
    }
  };


  return (
    <Card sx={{ width: '100%', display: 'flex',flexDirection: 'column' }}>
      <CardMedia
        component="img"
        alt="Forum Header"
        height={isMobile ? "80" : "100"}
        image="https://cdn.textures4photoshop.com/tex/thumbs/300/webp/blue-sky-gradient-thumb17.webp"
      />

      {message && (
        <PositionedSnackbar message={message} />
      )}

      <Box 
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'center' : 'center',
          width: '100%',
          padding: theme.spacing(1),
          gap: theme.spacing(0.5)
        }}
      >
        <CardContent
           sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: isMobile ? '8px !important' : undefined ,
            p: isMobile?0:1.5
          }}
        >
          <Stack spacing={2} direction="row" sx={{ alignItems: 'center', flexDirection: isMobile ? 'column' : 'row',textAlign: isMobile ? 'center' : 'left' }}>
            <Avatar
              alt="Forum Logo"
              src={bannerUrl}
              sx={{ 
                width: isMobile ? 45 : 60, 
                height: isMobile ? 45 : 60, 
                border: 2, 
                borderColor: 'primary.main' 
              }}
            />
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="div"
              sx={{ 
                margin: isMobile ? '0 !important' : undefined 
              }}
            >
              {forum.name}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ 
            display: 'flex', 
            gap: theme.spacing(1),
            padding: isMobile ? '8px !important' : undefined,
            pr: isMobile ? undefined : 4 
          }}>

          {subscribed && 
          <Tooltip title="Create Post" arrow>
            <Button
              disabled = {forum.isActive? false : true}
              onClick={()=>navigate('/user/create-post', { state: { forumName: forum.name, forumId: forum.id } })}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ borderRadius: 28, border: 2 }}
              disableElevation
              size="small"
            >
              Create
            </Button>
          </Tooltip>}

          <Tooltip title={subscribed ? "Unsubscribe" : "Subscribe"} arrow>
            <Button
              disabled = {forum.isActive? false : true}
              size="small"
              variant={subscribed? 'outlined': 'contained'}
              sx={{ borderRadius: 28, border: 2 }}
              disableElevation
              onClick={subscribed? (event) => handleUnSubscribe(event, forum.forum_id) : (event) => handleSubscribe(event, forum.forum_id)}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </Tooltip>
        </CardActions>
      </Box>
    </Card>
  );
}