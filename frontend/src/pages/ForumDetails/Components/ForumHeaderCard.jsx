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

export default function ForumHeaderCard({ forum }) {
  const navigate=useNavigate()
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function isSubscribed(forum) {
      const isUserSubscribed = await axios.get(`http://localhost:8080/forum/is-subscribed/${forum.id}`, {
        withCredentials: true,
    });
      console.log(isUserSubscribed.data.isSubscribed);
      setSubscribed(isUserSubscribed.data.isSubscribed);
    }

    isSubscribed(forum);
  }, []);

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
      setSubscribableForumsState((prevState) =>
        prevState.filter((id) => id !== forumId)
      );

      setTimeout(() => {
        setMessage(null);
        // window.location.reload();
        setCounter((val) => val + 1);
        navigate('/user/forums')
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
        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJmEl5gk6MOADiLcjX04ablq3EGntiGWrI3A&s"
        sx={{ borderRadius: 1 }}
      />
      <Stack spacing={2} direction="row" sx={{ justifyContent: 'space-between', width: '100%' }}>
        <CardContent>
          <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
            <Avatar
              alt="Forum Logo"
              src={forum.logo}
              sx={{ width: 60, height: 60, border: 3, borderColor: 'primary.main' }}
            />
            <Typography variant="h4" component="div" >
              {forum.name}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ pr: 4 }}>
          <Tooltip title="Create Post" arrow>
            <Button
              onClick={()=>navigate('/user/create-post')}
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
              // onClick={handleCreatePost}
              size="small"
              variant={subscribed? 'outlined': 'contained'}
              // color={subscribed? 'secondary' : 'primary'}
              sx={{ borderRadius: 28, border: 2 }}
              disableElevation
              onClick={subscribed? (event) => handleUnsubscribe(event, forum.id) : handleSubscribe}
            >
              {subscribed? 'Subscribed' : 'Subscribe'}
            </Button>
          </Tooltip>
        </CardActions>
      </Stack>
    </Card>
  );
}
