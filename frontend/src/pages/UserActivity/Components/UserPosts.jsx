import { useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { renderHTML } from "../../PostDetails/Components/CodeBlockViewer";
import { formatDate } from "../../../../utils/timestamp";
import { Box, Skeleton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/axiosInstance";
import axios from "axios";


export default function UserPosts() {
  const { userPosts, userDetails, isCurrentUser } = useSelector((state) => state.userActivity);
  const [forumBanners, setForumBanners] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getForumBanners = async (posts) => {
    try {
      await Promise.all(posts.map(async (post) => {
        const banner = await axios.get(`http://localhost:8080/forum/banner/${post.forum_id}`, {responseType: 'blob', withCredentials: true});
        
        if (banner.data) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setForumBanners((prevBanners) => ({ ...prevBanners, [post.forum_id]: reader.result }));
          };
          reader.readAsDataURL(banner.data);
        }
      }));
    } catch (error) {
      console.log("ERROR FETCHING FORUM BANNER:", error);
    }
  }

  useEffect(() => {
    getForumBanners(userPosts).then(() => setLoading(false));
  }, []);

  return (
    loading ? 
    <Box sx={{ width: '100%' }}>
    {Array.from({ length: userPosts?.length || 1 }).map((_, index) => (
      <Skeleton key={index} variant="rounded" height={80} sx={{ my: 1 }} />
    ))}
    </Box> :
    <>
      {userPosts?.length === 0 ? 
      <Typography
      component="span"
      variant="h3"
      sx={{
        color: "#414141",
        display: "inline",
        fontWeight: "500",
        fontSize: "16px",
      }}
      >
        {isCurrentUser ? 'You have' : `${userDetails.username} has`} not posted yet<br />
      </Typography> :
      <List sx={{ width: "100%" }}>
        {userPosts.map((post) => {
          return (
            <>
              <ListItem
                alignItems="flex-start"
                sx={{ bgcolor: "background.paper", borderRadius: 5, my: 1 }}
              >
                <ListItemAvatar sx={{ minWidth: "35px" }}>
                  <Avatar
                    sx={{
                      border: "0.5px solid rgba(50, 56, 53, 0.18)",
                      width: "25px",
                      height: "25px",
                    }}
                    alt={post.forum.name}
                    src={forumBanners[post.forum.id]}
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{ cursor: "pointer", wordBreak: "break-word", mx: "0" }}
                  primary={
                    <>
                      <span
                        style={{
                          fontSize: "13px",
                          textDecoration: "underline",
                        }}
                        onClick={() =>
                          navigate(`/forum/${post.forum.forum_id}`)
                        }
                      >
                        {post.forum.name}
                      </span>{" "}
                      <Tooltip
                        title={new Date(post.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                        placement="right"
                      >
                        <span style={{ fontSize: "13px" }}>
                          {" "}
                          • {formatDate(post.createdAt)} {formatDate(post.createdAt) ==='just now' ? '' : 'ago'}
                        </span>
                      </Tooltip>
                    </>
                  }
                  secondary={
                    <div
                      style={{
                        marginTop: "5px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        width: "100%",
                      }}
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color: "#414141",
                          display: "inline",
                          fontWeight: "500",
                          fontSize: "16px",
                        }}
                      >
                        {post.title} <br />
                      </Typography>
                      <span>{renderHTML(post.content)}</span>
                    </div>
                  }
                />
              </ListItem>
            </>
          );
        })}
      </List>
      }
    </>
  );
}
