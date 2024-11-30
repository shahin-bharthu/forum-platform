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
import { Box, Button, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Avatar from '@mui/material/Avatar';
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
    const [forumTopics, setForumTopics] = useState([{ title: 'topic title', content: 'topic content', forum: { name: 'username', id: null } }]);
    const [expanded, setExpanded] = useState([{ isExpanded: false }]);
    const [forumBanner, setForumBanner] = useState({})
    const navigate = useNavigate()
    useEffect(() => {
        async function getForumTopics() {
            const myTopics = await axios.get(`http://localhost:8080/topic/recent-topics`, {
                withCredentials: true,
            });
            const myTopicsData = myTopics.data.data;
            setForumTopics(myTopicsData);

            let array = [];

            for (let i = 0; i < myTopicsData.length; i++) array.push({ isExpanded: false });

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
            <Box sx={{ justifySelf: 'left', mx: 2, py: 3 }}>
                <p>Subscribe to forums of your interest to see their latest posts!</p>
                <Button onClick={() => navigate('/user/forums')}>Explore Forums</Button>
            </Box>
        )
    }

    return (
        <>
            <Grid size={12} sx={{ width: '100%' }} >
                {forumTopics.map((topic, index) =>
                    <Box key={index} mb={2}>
                        <Card >
                            <StyledCardHeader
                                avatar={
                                    <Link href={`/forum/${topic.forum.forum_id}`}>
                                        <Avatar aria-label="Forum Banner" src={forumBanner[topic.forum_id]}>
                                            {topic.forum.name}
                                        </Avatar>
                                    </Link>
                                }
                                // action={
                                //     <IconButton aria-label="settings">
                                //         <MoreVertIcon />
                                //     </IconButton>
                                // }
                                title={< Link href={`/forum/${topic.forum.forum_id}`} color="inherit" underline="hover">{topic.forum.name}</Link>}
                                subheader={new Date(topic.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            />
                            <CardContent sx={{ py: 0, px: 3 }} >
                                <Typography variant="h6" sx={{ textAlign: 'left', wordBreak: 'break-word' }}>
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
                                    <Typography variant='body2' sx={{ marginBottom: 2, textAlign: 'left', wordBreak: 'break-word', whiteSpace: "pre-wrap" }}>
                                        {topic.content}
                                    </Typography>
                                </CardContent>
                            </Collapse>
                        </Card>
                    </Box>
                )}
            </Grid >
        </>
    );
}