import {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { Box } from '@mui/material';
import { useLoaderData } from 'react-router-dom';

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

export default function MyPosts() {
  const [forumTopics, setForumTopics] = useState([{title: 'topic title', content: 'topic content', username: 'username'}]);
  const [expanded, setExpanded] = useState([{isExpanded: false}]);
//   const {topics} = useLoaderData();

  useEffect(() => {    
    console.log("useeffect");
    
    async function getForumTopics() {
      const forumTopics = await axios.get(`http://localhost:8080/topic/my-topics`, {
        withCredentials: true,
    });
    console.log(forumTopics);

    const forumTopicsData = forumTopics.data.data;
    const topicCreatorsList = await Promise.all(forumTopicsData.map(forumTopic => axios.get(`http://localhost:8080/user/${forumTopic.forum_id}`, {withCredentials: true})))
    const topicCreatorsUsername = topicCreatorsList.map(creator => creator.data.user.username)

    const updatedForumTopics = forumTopicsData.map((forumTopic, index) => ({
      ...forumTopic,              
      username: topicCreatorsUsername[index]  
    }));
    
    setForumTopics(updatedForumTopics);

    let array = [];

    for (let i = 0; i < updatedForumTopics.length; i++) array.push({isExpanded: false});

    setExpanded(array);
    }

    getForumTopics();
  }, []);

  const handleExpandClick = (i) => {
    const array = [...expanded];
    array[i].isExpanded = !array[i].isExpanded;
    setExpanded(array);
  };

  return (
    <>
    <h1>My Posts</h1>
    {forumTopics.map((topic, index) => 
    <Box key={index} mb={2}>
      <Card >
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title = {topic.title}
        subheader = {new Date(topic.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      />

      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {topic.username}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded[index].isExpanded}
          onClick={() => handleExpandClick(index)}
          aria-expanded={expanded[index].isExpanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded[index].isExpanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography sx={{ marginBottom: 2 }}>{topic.content}</Typography>
        </CardContent>
      </Collapse>
      </Card>
    </Box>
    )}
    </>
  );
}


// export async function myPostsLoader() {
//     const response = await axios.get(`http://localhost:8080/topic/my-topics`, {withCredentials: true});
//     // console.log(response.data.data);
//     return {
//         topics: response.data.data
//     }
// }