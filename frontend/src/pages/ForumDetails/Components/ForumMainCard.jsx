import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import ThumbDownAltRoundedIcon from '@mui/icons-material/ThumbDownAltRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { Avatar, Box } from '@mui/material';

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

export default function ForumMainCard({ forum }) {
  const [forumTopics, setForumTopics] = useState([{ title: 'topic title', content: 'topic content', username: 'username' }]);
  const [expanded, setExpanded] = useState([{ isExpanded: false }]);
  const [userAvatar, setUserAvatar] = useState({})

  useEffect(() => {
    async function getForumTopics() {
      const forumTopics = await axios.get(`http://localhost:8080/forum/topics/${forum.forum_id}`, {
        withCredentials: true,
      });
      const forumTopicsData = forumTopics.data.data;
      const topicCreatorsList = await Promise.all(forumTopicsData.map(forumTopic => axios.get(`http://localhost:8080/user/${forumTopic.createdBy}`, { withCredentials: true })))
      const topicCreatorsUsername = topicCreatorsList.map(creator => creator.data.user.username)

      const updatedForumTopics = forumTopicsData.map((forumTopic, index) => ({
        ...forumTopic,
        username: topicCreatorsUsername[index]
      }));

      setForumTopics(updatedForumTopics);

      let array = [];

      for (let i = 0; i < updatedForumTopics.length; i++) array.push({ isExpanded: false });

      setExpanded(array);

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

  if (forumTopics.length === 0) {
    return (
      <>
        <Box mb={2}>
          <Card sx={{ height: '50vh' }} >
            <Typography variant="h5" component="div" sx={{ textAlign: "center", py: 5 }}>
              No Posts Yet!
            </Typography>
          </Card>
        </Box>
      </>
    )
  }

  return (
    <>
      {forumTopics.map((topic, index) =>
        <Box key={index} mb={2}>
          <Card >
            <StyledCardHeader
              avatar={
                <Avatar aria-label="user avatar" src={userAvatar[topic.createdBy]} >
                  {topic.username?.[0]?.toUpperCase()}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={topic.username}
              subheader={new Date(topic.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            />

            <CardContent sx={{ py: 0, px: 3 }}>
              <Typography variant="h6" sx={{ textAlign: 'left' }}>
                {topic.title}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              {/* <IconButton >
                <ThumbUpAltRoundedIcon />
              </IconButton>
              <IconButton >
                <ThumbDownAltRoundedIcon />
              </IconButton> */}
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
              <CardContent sx={{px:3}} >
                <Typography sx={{ marginBottom: 2, textAlign: 'left' }}>{topic.content}</Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Box>
      )}
    </>
  );
}