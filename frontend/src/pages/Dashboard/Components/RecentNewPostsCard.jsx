import { useState, useEffect, memo, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../utils/timestamp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TopicSkeleton from '../../../components/PostsSkeleton';
import axiosInstance from '../../../../utils/axiosInstance.js';

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

export default function MyPosts() {
    const [forumTopics, setForumTopics] = useState([{ title: 'topic title', content: 'topic content', forum: { name: 'username', id: null } }]);
    const [expanded, setExpanded] = useState([{ isExpanded: false }]);
    const [forumBanner, setForumBanner] = useState({})
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate()

    const fetchForumBanners = useCallback(async (topics) => {
        const bannerPromises = topics.map(async (topic) => {
            try {
                const response = await axiosInstance.get(`/forum/banner/${topic.forum_id}`,{responseType: "blob"});

                if (response.data) {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve({
                                forumId: topic.forum_id,
                                bannerUrl: reader.result
                            });
                        };
                        reader.readAsDataURL(response.data);
                    });
                }
                return null;
            }
            catch (error) {
                console.error('Error fetching banner for forum: ', error);
                return null;
            }
        });

        const banners = await Promise.all(bannerPromises);

        const bannerMap = banners.reduce((acc, banner) => {
            if (banner) {
                acc[banner.forumId] = banner.bannerUrl;
            }
            return acc;
        }, {});

        setForumBanner(bannerMap);
    }, []);

    const fetchForumTopics = useCallback(async () => {
        try {
            setIsLoading(true);
            const myTopics = await axiosInstance.get(`/topic/recent-topics`);
            const myTopicsData = myTopics.data.data || [];

            setForumTopics(myTopicsData);

            // Initialize expanded state
            setExpanded(myTopicsData.map(() => ({ isExpanded: false })));

            // Fetch forum banners
            await fetchForumBanners(myTopicsData);
        } catch (error) {
            console.error('Error fetching forum topics:', error);
            setForumTopics([]);
        } finally {
            setIsLoading(false);
        }
    }, [fetchForumBanners]);

    useEffect(() => {
        fetchForumTopics();
    }, [fetchForumTopics]);

    const handleExpandClick = (i) => {
        const array = [...expanded];
        array[i].isExpanded = !array[i].isExpanded;
        setExpanded(array);
    };


    // Loading state
    if (isLoading) {
        return (
            <Grid size={12} sx={{ width: '100%' }}>
                {[1, 2, 3].map((_, index) => (
                    <TopicSkeleton key={index}/>
                ))}
            </Grid>
        );
    }


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
                                title={< Link href={`/forum/${topic.forum.forum_id}`} color="inherit" underline="hover">{topic.forum.name}</Link>}
                                subheader={formatDate(topic.createdAt)}
                            />
                            <CardContent sx={{ py: 0, px: 3, cursor: 'pointer' }} onClick={() => navigate(`/post/${topic.id}`)}>
                                <Typography variant="h6" sx={{ textAlign: 'left', wordBreak: 'break-word' }}>
                                    {topic.title}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton onClick={() => navigate(`/post/${topic.id}`)} >
                                    <ChatBubbleOutlineIcon />
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