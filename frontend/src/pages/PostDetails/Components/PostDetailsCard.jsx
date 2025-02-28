import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  styled,
  Skeleton,
  Tooltip,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useState, useEffect, useCallback, useMemo } from "react";
import CommentInput from "./CommentInput";
import ParentComments from "./ParentComments";
import { formatDate } from "../../../../utils/timestamp";
import axiosInstance from "../../../../utils/axiosInstance.js";
import { renderHTML } from "./CodeBlockViewer.jsx";
import axios from "axios";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  ".MuiCardHeader-content": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
  },
  ".MuiCardHeader-title, .MuiCardHeader-subheader, .MuiCardHeader-action": {
    margin: 0,
  },
}));

export default function PostDetailsCard({ post, user, forum }) {
  const navigate = useNavigate();
  const [postLikes, setPostLikes] = useState({
    count: post.likes_count,
    isliked: post.isLikedByCurrentUser,
  });
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [refreshPage, setRefreshPage] = useState(false);

  const handleLike = useCallback(async (event, postId) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/topic/like/${postId}`,
        {},
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setPostLikes((prev) => ({
          count: prev.count + 1,
          isliked: true,
        }));
      } else {
        setPostLikes((prev) => ({
          count: prev.count - 1,
          isliked: false,
        }));
      }
    } catch (error) {
      console.error("Error liking topic:", error);
      setPostLikes((prev) => ({
        count: prev.count - 1,
        isliked: false,
      }));
    }
    console.log("Like button clicked");
  }, []);

  const handleUnlike = useCallback(async (event, postId) => {
    // setIsLiked(prev => !prev);
    event.preventDefault();
    try {
      const response = await axios.delete(
        `http://localhost:8080/topic/unlike/${postId}`,
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setPostLikes((prev) => ({
          count: prev.count - 1,
          isliked: false,
        }));
      } else {
        setPostLikes((prev) => ({
          count: prev.count + 1,
          isliked: true,
        }));
      }
    } catch (error) {
      console.error("Error unliking topic:", error);
      setPostLikes((prev) => ({
        count: prev.count + 1,
        isliked: true,
      }));
    }
    console.log("Unlike button clicked");
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshPage((prev) => !prev);
  }, []);

  const fetchUserAvatar = useCallback(async (userId) => {
    setIsAvatarLoading(true);
    try {
      const response = await axiosInstance.get(`/user/avatar/${userId}`, {
        responseType: "blob",
      });

      if (response.data) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUserAvatarUrl(reader.result);
          setIsAvatarLoading(false);
        };
        reader.readAsDataURL(response.data);
      } else {
        setIsAvatarLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch user avatar:", error);
      setIsAvatarLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAvatar(user.id);
  }, [user.id, fetchUserAvatar]);

  const avatarContent = useMemo(() => {
    if (isAvatarLoading) {
      return <Skeleton variant="circular" width={30} height={30} />;
    }
    return (
      <Avatar
        aria-label="Forum Banner"
        src={userAvatarUrl}
        sx={{ width: 30, height: 30 }}
      />
    );
  }, [isAvatarLoading, userAvatarUrl]);

  return (
    <Box mb={2}>
      <Card>
        <StyledCardHeader
          avatar={avatarContent}
          action={
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
          }
          title={user.username}
          subheader={
            <Tooltip
              title={new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              placement="right"
            >
              {formatDate(post.createdAt)}
            </Tooltip>
          }
        />
        <CardContent sx={{ py: 0, px: 3 }}>
          <Typography
            variant="h6"
            sx={{ textAlign: "left", wordBreak: "break-word" }}
          >
            {post.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              marginBottom: 2,
              textAlign: "left",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {renderHTML(post.content)}
          </Typography>
        </CardContent>
        <CardActions sx={{ mx: 1 }}>
          <Button
            onClick={
              !postLikes.isliked
                ? (event) => handleLike(event, post.id)
                : (event) => handleUnlike(event, post.id)
            }
            sx={{ borderRadius: 5 }}
          >
            {postLikes.isliked ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
            <Typography variant="caption" sx={{ ml: 1 }}>
              {postLikes.count}
            </Typography>
          </Button>
        </CardActions>
        {forum.isActive && (
          <CommentInput
            postId={post.id}
            parentCommentId={null}
            onCommentadded={handleRefresh}
          />
        )}
        <CardContent>
          <Typography variant="h6" sx={{ textAlign: "left", mx: 1 }}>
            Comments
          </Typography>
          <ParentComments postId={post.id} refreshKey={refreshPage} />
        </CardContent>
      </Card>
    </Box>
  );
}
