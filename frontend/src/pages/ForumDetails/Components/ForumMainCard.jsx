import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Box, Button, Grid2 as Grid, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../utils/timestamp';
import TopicSkeleton from '../../../components/PostsSkeleton';
import axiosInstance from '../../../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import { renderHTML } from '../../PostDetails/Components/CodeBlockViewer';
import axios from 'axios';

const StyledCardHeader = memo(styled(CardHeader)(({ theme }) => ({
  '.MuiCardHeader-content': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  '.MuiCardHeader-title': {
    margin: 0,
  },
  '.MuiCardHeader-subheader': {
    margin: 0,
  }
})));

const ExpandMore = memo(styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
})));


export default function ForumMainCard({ forum, setPostLength, isBlur,style }) {
  const [forumTopics, setForumTopics] = useState([{ title: 'topic title', content: 'topic content', user: { username: 'username' }, }]);
  const [expanded, setExpanded] = useState([{ isExpanded: false }]);
  const [userAvatar, setUserAvatar] = useState({})
  const [postLikes, setPostLikes] = useState({});

  const isLoading = useSelector(state => state.loading.isLoading);
  
  const navigate = useNavigate()

  const fetchForumTopics = useCallback(async () => {
    try {
      const forumTopicsResponse = await axiosInstance.get(`/forum/topics/${forum.forum_id}`);
      
      const forumTopicsData = forumTopicsResponse.data.data;

      // Initialize state arrays
      const expandedState = forumTopicsData.map(() => ({ isExpanded: false }));
      let likesMap = {};
      forumTopicsData.forEach(topic => {
        likesMap[topic.id] = {
          count :topic.likes_count,
          isLiked: topic.isLikedByCurrentUser
        }
      });
      setPostLikes(likesMap);
      setForumTopics(forumTopicsData);
      setExpanded(expandedState);
      setPostLength(forumTopicsData.length);

      // Fetch user avatars
      const avatarPromises = forumTopicsData.map(async (topic) => {
        try {
          const response = await axiosInstance.get(
            `/user/avatar/${topic.createdBy}`,
            {
              responseType: "blob",
            }
          );

          if (response.data) {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({ [topic.createdBy]: reader.result });
              };
              reader.readAsDataURL(response.data);
            });
          }
          return null;
        } catch (error) {
          console.error('Error fetching avatar:', error);
          return null;
        }
      });

      const avatarResults = await Promise.all(avatarPromises);
      const avatarMap = avatarResults.reduce((acc, result) =>
        result ? { ...acc, ...result } : acc,
        {});

      setUserAvatar(avatarMap);
    } catch (error) {
      console.error('Error fetching forum topics:', error);
    }
  }, [forum.forum_id, setPostLength]);

  // Fetch topics on component mount
  useEffect(() => {
    fetchForumTopics();
  }, [fetchForumTopics]);

  // Memoized click handlers
  const handleExpandClick = useCallback((index) => {
    setExpanded(prev => {
      const newExpanded = [...prev];
      newExpanded[index].isExpanded = !newExpanded[index].isExpanded;
      return newExpanded;
    });
  }, []);

  const handleLike = useCallback( async (event,topicId) => {
    event.preventDefault()
    try {
      const response = await axios.post(`http://localhost:8080/topic/like/${topicId}`,
        {},
      {
        "Content-Type": "application/json",
        withCredentials: true,
      });
      if(response.status === 200){
        setPostLikes(prevLikes => {   
          return {
            ...prevLikes,
            [topicId]: {
              count: prevLikes[topicId].count + 1,
              isLiked: true
            }
          }});
      }
    } catch (error) {
      console.error('Error liking topic:', error);
      setPostLikes(prevLikes => { 
        return {
          ...prevLikes,
          [topicId]: {
            count: prevLikes[topicId].count - 1,
            isLiked: false
          }
        }});
    }
  }, []);

  const handleUnlike = useCallback( async (event, topicId) => {
    event.preventDefault()
    try {
      const response = await axios.delete(`http://localhost:8080/topic/unlike/${topicId}`,
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );
      if(response.status === 200){
        setPostLikes(prevLikes => {   
          return {
            ...prevLikes,
            [topicId]: {
              count: prevLikes[topicId].count - 1,
              isLiked: false
            }
          }});
      }
    } catch (error) {
      console.error('Error unliking topic:', error);
      setPostLikes(prevLikes => { 
        return {
          ...prevLikes,
          [topicId]: {
            count: prevLikes[topicId].count + 1,
            isLiked: true
          }
        }});
    }
  }, []);

  if (isLoading && !isBlur) {
    return (
      <Grid size={12} sx={{ width: '100%' }}>
        {[1, 2, 3].map((_, index) => (
          <TopicSkeleton key={index} />
        ))}
      </Grid>
    );
  }


  if (forumTopics.length === 0) {
    return (
      <>
        <Box mb={2} sx={style}>
          <Typography variant="h5" component="div" sx={{ textAlign: "center", py: 5 }}>
            No Posts Yet!
          </Typography>
        </Box>
      </>
    )
  }

  return (
    <>
      {forumTopics.map((topic, index) =>
        <Box key={index} mb={2} sx={style}>
          <Card>
            <StyledCardHeader
              avatar={
                <Avatar aria-label="user avatar" src={userAvatar[topic.createdBy]} sx={{ width: 35, height: 35 }}>
                  {topic.username?.[0]?.toUpperCase()}
                </Avatar>
              }
              title={topic.user.username}
              
              subheader={<Tooltip title={new Date(topic.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })} placement="right">
                {formatDate(topic.createdAt)}
              </Tooltip>}
            />

            <CardContent sx={{ py: 0, px: 3, cursor: 'pointer' }} onClick={() => navigate(`/post/${topic.id}`)}>
              <Typography variant="body1" sx={{ textAlign: 'left', wordBreak: 'break-word', }}>
                {topic.title}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <Button 
                sx={{borderRadius:5}} 
                onClick={ postLikes[topic.id]?.isLiked ? (event) => handleUnlike(event,topic.id) : (event) => handleLike(event, topic.id)} >
                {!postLikes[topic.id]?.isLiked ? <FavoriteBorderIcon fontSize='small' /> : <FavoriteIcon fontSize='small' color='error' />}
                <Typography variant='caption' sx={{ml:1 }}>
                  {postLikes[topic.id]?.count || topic.likes_count}
                </Typography>
              </Button>
              <IconButton onClick={() => navigate(`/post/${topic.id}`)} >
                <ChatBubbleOutlineIcon fontSize='small' />
              </IconButton>
              <ExpandMore
                expand={expanded[index].isExpanded}
                onClick={() => handleExpandClick(index)}
                aria-expanded={expanded[index].isExpanded}
                aria-label="show more"
                size="small"
              >
                <ExpandMoreIcon fontSize='inherit' />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded[index].isExpanded} timeout="auto" unmountOnExit>
              <CardContent sx={{ px: 3, cursor: 'pointer' }} onClick={() => navigate(`/post/${topic.id}`)}>
                <Typography variant='caption' sx={{ marginBottom: 2, textAlign: 'left', wordBreak: 'break-word', whiteSpace: "pre-wrap" }}>
                  {renderHTML(topic.content)}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Box>
      )}
    </>
  );
}
