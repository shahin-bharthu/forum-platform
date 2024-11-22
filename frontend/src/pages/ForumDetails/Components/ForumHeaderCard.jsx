import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Stack, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PositionedSnackbar from '../../../components/SnackBar';

export default function ForumHeaderCard({ forum }) {
  const navigate = useNavigate()
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
    <Card sx={{ width: '100%' }}>
      <CardMedia
        component="img"
        alt="Forum Header"
        height="100"
        image="https://cdn.textures4photoshop.com/tex/thumbs/300/webp/blue-sky-gradient-thumb17.webp"
      />
      {message && (
        <PositionedSnackbar message={message} />
      )}
      <Stack spacing={2} direction="row" sx={{ justifyContent: 'space-between', width: '100%' }}>
        <CardContent>
          <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
            <Avatar
              alt="Forum Logo"
              src={bannerUrl}
              sx={{ width: 60, height: 60, border: 2, borderColor: 'primary.main' }}
            />
            <Typography variant="h4" component="div" >
              {forum.name}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ pr: 4 }}>
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
          </Tooltip>

          <Tooltip title={subscribed ? "Unsubscribe": "Subscribe"} arrow>
            <Button
              disabled = {forum.isActive? false : true}
              size="small"
              variant={subscribed? 'outlined': 'contained'}
              sx={{ borderRadius: 28, border: 2 }}
              disableElevation
              onClick={subscribed? (event) => handleUnSubscribe(event, forum.forum_id) : (event) => handleSubscribe(event, forum.forum_id)}
            >
              {subscribed? 'Subscribed' : 'Subscribe'}
            </Button>
          </Tooltip>
        </CardActions>
      </Stack>
    </Card>
  );
}
