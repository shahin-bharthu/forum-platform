import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { Avatar, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../utils/timestamp';

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
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
}));

const ExpandMore = styled((props) => {
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
}));

export default function ForumMainCard({ forum, setPostLength, isBlur,style }) {
  const [forumTopics, setForumTopics] = useState([{ title: 'topic title', content: 'topic content', user: { username: 'username' }, }]);
  const [expanded, setExpanded] = useState([{ isExpanded: false }]);
  const [userAvatar, setUserAvatar] = useState({})
  const [isLiked,setIsLiked]=useState([{liked:false}])
  const navigate=useNavigate()
  useEffect(() => {
    async function getForumTopics() {
      const forumTopics = await axios.get(`http://localhost:8080/forum/topics/${forum.forum_id}`, {
        withCredentials: true,
      });
      const forumTopicsData = forumTopics.data.data;

      setForumTopics(forumTopicsData);

      let array = [];
      let array2=[]
      for (let i = 0; i < forumTopicsData.length; i++) array.push({ isExpanded: false });
      for (let i = 0; i < forumTopicsData.length; i++) array2.push({ liked: false });
      setExpanded(array);
      setIsLiked(array2)
      setPostLength(forumTopicsData.length)

      await Promise.all(
        forumTopicsData.map(async (topic) => {
          try {
            const response = await axios.get(
              `http://localhost:8080/user/avatar/${topic.createdBy}`,
              {
                withCredentials: true,
                responseType: "blob",
              }
            )

            if (response.data) {
              const reader = new FileReader()
              reader.onloadend = () => {
                setUserAvatar(prev => ({
                  ...prev, [topic.createdBy]: reader.result
                }))
              }
              reader.readAsDataURL(response.data)
            }
          }
          catch (error) {
            console.error('Error fetching banner for forum: ', error);
          }
        })
      )
    }

    getForumTopics();
  }, []);

  const handleExpandClick = (i) => {
    const array = [...expanded];
    array[i].isExpanded = !array[i].isExpanded;
    setExpanded(array);
  };

  const handleLike =(i)=>{
    const array=[...isLiked]
    array[i].liked=!array[i].liked
    setIsLiked(array); 
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
                <Avatar aria-label="user avatar" src={userAvatar[topic.createdBy]} sx={{width: 35, height: 35}}>
                  {topic.username?.[0]?.toUpperCase()}
                </Avatar>
              }
              // action={
              //   <IconButton aria-label="settings">
              //     <MoreVertIcon />
              //   </IconButton>
              // }
              title={topic.user.username}
              subheader={formatDate(topic.createdAt)}
            />

            <CardContent sx={{ py: 0, px: 3,cursor:'pointer' }} onClick={()=>navigate(`/post/${topic.id}`)}>
              <Typography variant="body1" sx={{ textAlign: 'left',wordBreak: 'break-word', }}>
                {topic.title}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton onClick={()=>handleLike(index)}>
                {!isLiked[index].liked && <FavoriteBorderIcon fontSize='small'/>}
                {isLiked[index].liked  && <FavoriteIcon fontSize='small' color='error' />}
              </IconButton>
              <IconButton onClick={()=>navigate(`/post/${topic.id}`)} >
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
              <CardContent sx={{ px: 3, cursor:'pointer' }} onClick={()=>navigate(`/post/${topic.id}`)}>
                <Typography sx={{ marginBottom: 2, textAlign: 'left',wordBreak: 'break-word', whiteSpace: "pre-wrap" }}>{topic.content}</Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Box>
      )}
    </>
  );
}
