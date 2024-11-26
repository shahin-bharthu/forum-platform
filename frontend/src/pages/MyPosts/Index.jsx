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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Avatar from '@mui/material/Avatar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PositionedSnackbar from '../../components/SnackBar';
import { useNavigate } from 'react-router-dom';

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

export default function MyPosts() {
  const [forumTopics, setForumTopics] = useState([{ title: 'topic title', content: 'topic content', username: 'username' }]);
  const [expanded, setExpanded] = useState([{ isExpanded: false }]);
  const [forumBanner, setForumBanner] = useState({})
  const [message, setMessage] = useState();
  const navigate = useNavigate();
  //   const {topics} = useLoaderData();

  const handleDeleteTopic = async (event, id) => {
    const response = await axios.delete(`http://localhost:8080/topic/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    });
    setMessage('Post deleted');
    setTimeout(() => {
      setMessage(null);
      window.location.reload();
    }, 1000);
  }

  useEffect(() => {
    // console.log("useeffect");

    async function getForumTopics() {
      const myTopics = await axios.get(`http://localhost:8080/topic/my-topics`, {
        withCredentials: true,
      });
      // console.log(myTopics);

      const myTopicsData = myTopics.data.data;
      const forumsList = await Promise.all(myTopicsData.map(forumTopic => axios.get(`http://localhost:8080/forum/${forumTopic.forum_id}`, { withCredentials: true })))
      const forumNames = forumsList.map(creator => creator.data.data.name)

      const updatedForumTopics = myTopicsData.map((forumTopic, index) => ({
        ...forumTopic,
        forumname: forumNames[index]
      }));

      setForumTopics(updatedForumTopics);

      let array = [];

      for (let i = 0; i < updatedForumTopics.length; i++) array.push({ isExpanded: false });

      setExpanded(array);

      await Promise.all(
        myTopicsData.map(async (topic) => {
          try {
            const response = await axios.get(
              `http://localhost:8080/forum/banner/${topic.forum_id}`,
              {
                withCredentials: true,
                responseType: "blob",
              }
            )

            if (response.data) {
              const reader = new FileReader()
              reader.onloadend = () => {
                setForumBanner(prev => ({
                  ...prev, [topic.forum_id]: reader.result
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

          <Typography variant="h5" component="div" sx={{ textAlign: "center", py: 5 }}>
            No Posts Yet!
          </Typography>

        </Box>
      </>
    )
  }

  return (
    <>
      <Grid size={12} sx={{ width: '100%', px: 3, mt: 10, alignSelf: 'start' }} >
      {message && (
        <PositionedSnackbar message={message} />
      )}        
      {forumTopics.map((topic, index) =>
          <Box key={index} mb={2}>
            <Card >
              <StyledCardHeader
                avatar={
                  <Avatar aria-label="Forum Banner" src={forumBanner[topic.forum_id]}>
                    {topic.forumname}
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings" onClick={(event) => handleDeleteTopic(event, topic.id)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                }
                title={topic.forumname}
                subheader={new Date(topic.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              />
              <CardContent sx={{ py: 0, px: 3 }} >
                <Typography variant="h6" sx={{ textAlign: 'left',wordBreak: 'break-word' }}>
                  {topic.title}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
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
                <CardContent sx={{ px: 3 }}>
                  <Typography variant='body2' sx={{ marginBottom: 2, textAlign: 'left', wordBreak:'break-word'}}>
                    {topic.content}
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          </Box>
        )}
      </Grid>
    </>
  );
}