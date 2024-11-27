import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardActions, Collapse, IconButton, Typography, Box, Grid2 as Grid, Avatar, Menu, MenuItem } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import axios from "axios";
import PositionedSnackbar from "../../components/SnackBar";
import { ExpandMore as ExpandMoreIcon, MoreVert as MoreVertIcon, Edit as EditIcon, Archive as ArchiveIcon, DeleteRounded as DeleteRoundedIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
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
}));

const StyledMenu = styled((props) => (
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
}));
const ExpandMore = styled((props) => {
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
}));

export default function MyPosts() {
  const [forumTopics, setForumTopics] = useState([
    { title: "topic title", content: "topic content", username: "username" },
  ]);
  const [expanded, setExpanded] = useState([{ isExpanded: false }]);
  const [forumBanner, setForumBanner] = useState({});
  const [message, setMessage] = useState();
  const [menuAnchor, setMenuAnchor] = useState(null);  // Track the anchor element for the menu
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    async function getForumTopics() {
      const myTopics = await axios.get(
        `http://localhost:8080/topic/my-topics`,
        {
          withCredentials: true,
        }
      );

      const myTopicsData = myTopics.data.data;
      const forumsList = await Promise.all(myTopicsData.map(forumTopic => axios.get(`http://localhost:8080/forum/${forumTopic.forum_id}`, { withCredentials: true })))
      const forumNames = forumsList.map(creator => creator.data.data.name)
      const forumIds = forumsList.map(creator => creator.data.data.forum_id)


      const updatedForumTopics = myTopicsData.map((forumTopic, index) => ({
        ...forumTopic,
        forumname: forumNames[index],
        forumids: forumIds[index]
      }));

      setForumTopics(updatedForumTopics);

      let array = [];

      for (let i = 0; i < updatedForumTopics.length; i++)
        array.push({ isExpanded: false });

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
            );

            if (response.data) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setForumBanner((prev) => ({
                  ...prev,
                  [topic.forum_id]: reader.result,
                }));
              };
              reader.readAsDataURL(response.data);
            }
          } catch (error) {
            console.error("Error fetching banner for forum: ", error);
          }
        })
      );
    }

    getForumTopics();
  }, []);

  const handleMenuClick = (event, index) => {
    setMenuAnchor(event.currentTarget);
    setActiveIndex(index);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setActiveIndex(null);
  };

  const handleDeleteTopic = async (id) => {
    handleCloseMenu();
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
  };

  const handleExpandClick = (i) => {
    const array = [...expanded];
    array[i].isExpanded = !array[i].isExpanded;
    setExpanded(array);
  };

  if (forumTopics.length === 0) {
    return (
      <>
        <Box mb={2}>
          <Typography
            variant="h5"
            component="div"
            sx={{ textAlign: "center", py: 5 }}
          >
            No Posts Yet!
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Grid size={12} sx={{ width: "100%", px: 3, mt: 10, alignSelf: "start" }}>
        {message && <PositionedSnackbar message={message} />}
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
                        onClick={handleCloseMenu} 
                        // onClick={()=>navigate(`/post/edit`, { state: { forumName: forum.name, forumId: forum.id } })} 
                      disableRipple>
                        <EditIcon />
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDeleteTopic(topic.id)}
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
                subheader={new Date(topic.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              />
              <CardContent sx={{ py: 0, px: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ textAlign: "left", wordBreak: "break-word" }}
                >
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
                  <ExpandMoreIcon fontSize="inherit" />
                </ExpandMore>
              </CardActions>
              <Collapse
                in={expanded[index].isExpanded}
                timeout="auto"
                unmountOnExit
              >
                <CardContent sx={{ px: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      marginBottom: 2,
                      textAlign: "left",
                      wordBreak: "break-word",
                    }}
                  >
                    {topic.content}
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
          </Box>
        ))}
      </Grid>
    </>
  );
}
