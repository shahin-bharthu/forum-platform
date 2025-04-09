import { useSelector } from "react-redux";
import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDate } from "../../../../utils/timestamp";
import axiosInstance from "../../../../utils/axiosInstance";
import axios from "axios";


export default function UserComments() {
  const { userComments, userDetails, isCurrentUser } = useSelector((state) => state.userActivity);
  const [forumBanners, setForumBanners] = useState({});
  const [formattedComments, setFormattedComments] = useState([
    { topic: {}, forum: {} },
  ]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getForumBanners = async (comments) => {
    try {
      const formattedComments = await Promise.all(
        comments.map(async (comment) => {
          const banner = await axios.get(
            `http://localhost:8080/forum/banner/${comment.topic.forum_id}`,
            { responseType: "blob", withCredentials: true }
          );

          if (banner.data) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setForumBanners((prevBanners) => ({
                ...prevBanners,
                [comment.topic.forum_id]: reader.result,
              }));
            };
            reader.readAsDataURL(banner.data);
          }

          const forumDetails = await axiosInstance.get(
            `/forum/${comment.topic.forum_id}`
          );
          return {
            ...comment,
            forum: forumDetails.data.data,
          };
        })
      );

      setFormattedComments(formattedComments);
    } catch (error) {
      console.log("ERROR FETCHING FORUM BANNER:", error);
    }
  };

  useEffect(() => {
    getForumBanners(userComments).then(() => setLoading(false));
  }, []);

  return (
    loading ? 
    <Box sx={{ width: '100%' }}>
    {Array.from({ length: userComments?.length || 1 }).map((_, index) => (
      <Skeleton key={index} variant="rounded" height={80} sx={{ my: 1 }} />
    ))}
    </Box>    
    :
    <>
    {userComments?.length === 0 ? 
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
        {isCurrentUser ? 'You have' : `${userDetails.username} has`} not commented on any posts yet<br />
      </Typography>  
      :
      <List sx={{ width: "100%" }}>
        {formattedComments.map((comment) => {
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
                    alt="Forum Banner"
                    src={forumBanners[comment.topic.forum_id]}
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{ cursor: "pointer", wordBreak: "break-word", mx: "0" }}
                  primary={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          textDecoration: "underline",
                        }}
                        onClick={() => navigate(`/forum/${comment.forum.forum_id}`)}
                      >
                        {comment.forum.name}
                      </span>
                      •
                      <Tooltip
                        title={comment.topic.title}
                        placement="bottom"
                      >
                        <div
                          style={{
                            width: "70%",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                            }}
                            onClick={() => navigate(`/post/${comment.topic.id}`)}
                          >
                            {comment.topic.title}
                          </span>
                        </div>
                      </Tooltip>
                    </div>
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
                    >
                      <span style={{fontSize: "13px"}}>
                        {userDetails.username} commented {" "}
                        <Tooltip title={new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}>
                          {" "}{formatDate(comment.createdAt)} {formatDate(comment.createdAt) ==='just now' ? '' : 'ago'} <br />
                        </Tooltip>
                      </span>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color: "#414141",
                          display: "inline",
                          fontWeight: "450",
                          fontSize: "14px",
                        }}
                      >
                      <span>{comment.content}</span>
                      </Typography>
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
