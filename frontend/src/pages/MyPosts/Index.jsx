import { useState, useEffect, useCallback, memo } from "react";
import {
  Card, CardHeader, CardContent, CardActions, Collapse,
  IconButton, Typography, Box, Grid2 as Grid, Avatar, Menu,
  MenuItem, Link
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon,
  DeleteRounded as DeleteRoundedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { formatDate } from "../../../utils/timestamp";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TopicSkeleton from "../../components/PostsSkeleton";
import axiosInstance from "../../../utils/axiosInstance.js";
import { useDispatch, useSelector } from 'react-redux';
import { setPostCount } from "../../store/userPostSlice.js";
import { clearNotification, setNotification } from "../../store/uiSlice.js";
import AnimatedLayout from "../../components/AnimatedLayout.jsx";

const StyledCardHeader = memo(styled(CardHeader)(({ theme }) => ({
  ".MuiCardHeader-content": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
  },
  ".MuiCardHeader-title": {
    margin: 0,
  },
  ".MuiCardHeader-subheader": {
    margin: 0,
  },
})));

const StyledMenu = memo(styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },                                                            
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
})));

const ExpandMore = memo(styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
})));

export default function MyPosts() {
  const [forumTopics, setForumTopics] = useState([
    { title: "topic title", content: "topic content", username: "username" },
  ]);
  const [expanded, setExpanded] = useState([{ isExpanded: false }]);
  const [forumBanner, setForumBanner] = useState({});
  const [menuAnchor, setMenuAnchor] = useState(null);  // Track the anchor element for the menu
  const [activeIndex, setActiveIndex] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refresh, setrefresh] = useState(false);
  
  const isLoading = useSelector(state => state.loading.isLoading);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getForumTopics = useCallback(async () => {
    try {
      const myTopics = await axiosInstance.get(`/topic/my-topics`);
      const myTopicsData = myTopics.data.data;
      dispatch(setPostCount({
        userPostCount:myTopicsData.length
      }))
      const forumsList = await Promise.all(myTopicsData.map(forumTopic => axiosInstance.get(`/forum/${forumTopic.forum_id}`)));

      const forumNames = forumsList.map(creator => creator.data.data.name);
      const forumIds = forumsList.map(creator => creator.data.data.forum_id);

      const updatedForumTopics = myTopicsData.map((forumTopic, index) => ({
        ...forumTopic,
        forumname: forumNames[index],
        forumids: forumIds[index]
      }));

      setForumTopics(updatedForumTopics);
      setExpanded(updatedForumTopics.map(() => ({ isExpanded: false })));

      await Promise.all(
        updatedForumTopics.map(async (topic) => {
          try {
            const response = await axiosInstance.get(
              `/forum/banner/${topic.forum_id}`,
              { responseType: "blob" }
            );

            if (response.data) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setForumBanner(prev => ({
                  ...prev,
                  [topic.forum_id]: reader.result
                }));
              };
              reader.readAsDataURL(response.data);
            }
          } catch (error) {
            console.error("Error fetching banner for forum: ", error);
          }
        })
      );
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  }, [dispatch,refresh]);

  useEffect(() => {
    getForumTopics();
  }, [getForumTopics,dispatch]);


  const handleMenuClick = useCallback((event, index) => {
    setMenuAnchor(event.currentTarget);
    setActiveIndex(index);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuAnchor(null);
    setActiveIndex(null);
  }, []);

  const handleDeleteTopic = async () => {
    if (activeIndex !== null) {
      try {
        await axiosInstance.delete(`/topic/${activeIndex}`);
        dispatch(setNotification({message:'Post deleted', type:null}))
        setTimeout(() => {
          dispatch(clearNotification())
          setrefresh(prev=>!prev)
        }, 1000);
      } catch (error) {
        console.error("Error deleting post:", error);
        dispatch(setNotification({message:'Failed to delete post', type:'error'}))
        setTimeout(() => {
          dispatch(clearNotification())
        }, 1500);
      }
    }
    handleDialogClose();
  };


  const handleEditTopic = (event, id, name) => {
    handleCloseMenu()
    event.preventDefault();
    navigate(`/post/edit/${id}`, { state: { forumName: name, forumId: id } })
  }

  const handleExpandClick = (i) => {
    const array = [...expanded];
    array[i].isExpanded = !array[i].isExpanded;
    setExpanded(array);
  };

  const handleUpdateClick = (topicId) => {
    handleCloseMenu();
    setDialogOpen(true);
    setActiveIndex(topicId);
  };


  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const logoutDialog = (
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogContent>
        <DialogTitle sx={{ px: 0 }}>
          Delete Post
        </DialogTitle>
        <DialogContentText>
          Are you sure you want to delete this post?
          This action cannot be undone, and the post will be permanently removed.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleDeleteTopic}
          color="error"
          variant="contained"
        >
          Delete Post
        </Button>
      </DialogActions>
    </Dialog>
  )

  if (isLoading) {
    return (
      <AnimatedLayout size={12} sx={{ width: "100%", px: 3, mt: 10 }}>
        {[1, 2, 3].map((_, index) => (
          <TopicSkeleton key={index}/>
        ))}
      </AnimatedLayout>
    );
  }

  if (forumTopics.length === 0) {
    return (
      <>
        <AnimatedLayout mb={2}>
          <Typography
            variant="h5"
            component="div"
            sx={{ textAlign: "center", py: 5 }}
          >
            No Posts Yet!
          </Typography>
        </AnimatedLayout>
      </>
    );
  }

  return (
    <>
      <AnimatedLayout size={12} sx={{ width: "100%", px: 3, mt: 10, alignSelf: "start" }}>
        {forumTopics.map((topic, index) => (
          <Box key={index} mb={2}>
            <Card>
              <StyledCardHeader
                avatar={
                  <Link href={`/forum/${topic.forumids}`} color="inherit" underline="hover">
                    <Avatar aria-label="Forum Banner" src={forumBanner[topic.forum_id]}>
                      {topic.forumname}
                    </Avatar>
                  </Link>
                }
                action={
                  <>
                    <IconButton
                      aria-label="settings"
                      onClick={(event) => handleMenuClick(event, index)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <StyledMenu
                      anchorEl={menuAnchor}
                      open={activeIndex === index}
                      onClose={handleCloseMenu}
                    >
                      <MenuItem
                        onClick={(event) => handleEditTopic(event, topic.id, topic.forumname)}
                        disableRipple>
                        <EditIcon />
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleUpdateClick(topic.id)} // Pass the specific topic ID
                        disableRipple
                      >
                        <DeleteRoundedIcon />
                        Delete
                      </MenuItem>
                      <MenuItem onClick={() => handleCloseMenu()} disableRipple>
                        <ArchiveIcon />
                        Archive
                      </MenuItem>
                    </StyledMenu>
                  </>
                }
                // title={topic.forumname}
                title={<Link href={`/forum/${topic.forumids}`} color="inherit" underline="hover">{topic.forumname}</Link>}
                subheader={formatDate(topic.createdAt)}
              />
              <CardContent sx={{ py: 0, px: 3, cursor: 'pointer' }} onClick={() => navigate(`/post/${topic.id}`)}>
                <Typography
                  variant="h6"
                  sx={{ textAlign: "left", wordBreak: "break-word" }}
                >
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
                  <ExpandMoreIcon fontSize="inherit" />
                </ExpandMore>
              </CardActions>
              <Collapse
                in={expanded[index].isExpanded}
                timeout="auto"
                unmountOnExit
              >
                <CardContent sx={{ px: 3, cursor: 'pointer' }} onClick={() => navigate(`/post/${topic.id}`)}>
                  <Typography
                    variant="body2"
                    sx={{
                      marginBottom: 2,
                      textAlign: "left",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {topic.content}
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          </Box>
        ))}
        {dialogOpen && logoutDialog}
      </AnimatedLayout>
    </>
  );
}