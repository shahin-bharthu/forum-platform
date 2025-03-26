import { useSelector } from "react-redux";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDate } from "../../../../utils/timestamp";
import axiosInstance from "../../../../utils/axiosInstance";

export default function UserComments() {
    const {userComments} = useSelector((state) => state.userActivity);
    const [forumBanners, setForumBanners] = useState({});
    const [formattedComments, setFormattedComments] = useState([{topic: {}, forum: {}}]);
    const navigate = useNavigate();
    
    const getForumBanners = async (comments) => {
        try {
          const formattedComments = await Promise.all(comments.map(async (comment) => {
            const banner = await axiosInstance.get(`/forum/banner/${comment.topic.forum_id}`, {responseType: 'blob'});
            
            if (banner.data) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setForumBanners((prevBanners) => ({ ...prevBanners, [comment.topic.forum_id]: reader.result }));
              };
              reader.readAsDataURL(banner.data);
            }

            const forumDetails = await axiosInstance.get(`/forum/${comment.topic.forum_id}`);
            return {
                ...comment,
                forum: forumDetails.data.data
            }
        }))
        console.log(formattedComments);
        
        setFormattedComments(formattedComments)
        } catch (error) {
          console.log("ERROR FETCHING FORUM BANNER:", error);
        }
      }
    
    useEffect(() => {
        getForumBanners(userComments);
    }, []);
    
    return (
        // <div>
        //     COMMENTS
        // </div>
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
                        <>
                          <span
                            style={{
                              fontSize: "13px",
                              textDecoration: "underline",
                            }}
                            onClick={() =>
                              navigate(`/forum/${comment.forum.id}`)
                            }
                          >
                            {comment.forum.name}
                          </span>{" "}
                          <Tooltip
                            title={new Date(comment.createdAt).toLocaleDateString(
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
                              • {formatDate(comment.createdAt)} ago
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
                          onClick={() => navigate(`/post/${comment.topic.id}`)}
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
                            {comment.topic.title} <br />
                          </Typography>
                          <span>{comment.content}</span>
                        </div>
                      }
                    />
                  </ListItem>
                </>
              );
            })}
          </List>
    );
}