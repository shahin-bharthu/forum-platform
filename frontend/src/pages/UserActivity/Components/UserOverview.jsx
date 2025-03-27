import { useSelector } from "react-redux";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { renderHTML } from "../../PostDetails/Components/CodeBlockViewer";
import { useState, useEffect } from "react";
import { formatDate } from "../../../../utils/timestamp";
import axiosInstance from "../../../../utils/axiosInstance";

export default function UserOverview() {
  const userActivity = useSelector((state) => state.userActivity);
  const navigate = useNavigate();
  const [forumBanners, setForumBanners] = useState({});

  const combinedActivity = [
    ...(userActivity?.userPosts?.map((post) => ({ ...post, type: "post" })) ||
      []),
    ...(userActivity?.userComments?.map((comment) => ({
      ...comment,
      type: "comment",
    })) || []),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getForumBanners = async (posts) => {
    try {
      await Promise.all(
        posts.map(async (post) => {
          const banner = await axiosInstance.get(
            `/forum/banner/${post.forum_id}`,
            { responseType: "blob" }
          );

          if (banner.data) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setForumBanners((prevBanners) => ({
                ...prevBanners,
                [post.forum_id]: reader.result,
              }));
            };
            reader.readAsDataURL(banner.data);
          }
        })
      );
    } catch (error) {
      console.log("ERROR FETCHING FORUM BANNER:", error);
    }
  };

  useEffect(() => {
    getForumBanners(userActivity?.userPosts);
  }, []);

  return (
    <>
      <div>
        <List>
          {combinedActivity.map((activity) => {
            if (activity.type === "post") {
              return (
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
                      alt={activity.forum.name}
                      src={forumBanners[activity.forum.id]}
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
                          {activity.forum.name}
                        </span>{" "}
                        <Tooltip
                          title={new Date(
                            activity.createdAt
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                          placement="right"
                        >
                          <span style={{ fontSize: "13px" }}>
                            {" "}
                            • {formatDate(activity.createdAt)} ago
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
                        onClick={() => navigate(`/post/${activity.id}`)}
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
                          {activity.title} <br />
                        </Typography>
                        <span>{renderHTML(activity.content)}</span>
                      </div>
                    }
                  />
                </ListItem>
              );
            } else {
              return (
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
                      src={forumBanners[activity.topic.forum_id]}
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
                          onClick={() =>
                            navigate(`/forum/${activity.forum.forum_id}`)
                          }
                        >
                          {activity.forum.name}
                        </span>
                        •
                        <Tooltip title={activity.topic.title} placement="bottom">
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
                              onClick={() =>
                                navigate(`/post/${activity.topic.id}`)
                              }
                            >
                              {activity.topic.title}
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
                        <span style={{ fontSize: "13px" }}>
                          {userDetails.username} commented{" "}
                          <Tooltip
                            title={new Date(
                              activity.createdAt
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          >
                            {" "}
                            {formatDate(activity.createdAt)} ago <br />
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
                          <span>{activity.content}</span>
                        </Typography>
                      </div>
                    }
                  />
                </ListItem>
              );
            }
          })}
        </List>
      </div>
    </>
  );
}