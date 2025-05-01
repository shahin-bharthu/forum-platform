import { useState, useEffect, useCallback, useRef } from "react";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  styled,
  Typography,
  CircularProgress,
  Link,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { formatDate } from "../../../../utils/timestamp";
import ChildrenComments from "./ChildrenComment";
import CommentInput from "./CommentInput";
import axiosInstance from "../../../../utils/axiosInstance.js";
import { useLocation, useSearchParams } from "react-router-dom";
import { UserHoverCard } from "../../../components/UserHoverCard.jsx";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  ".MuiCardHeader-content": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  ".MuiCardHeader-title": {
    margin: 0,
    fontWeight: 500,
  },
  ".MuiCardHeader-subheader": {
    margin: 0,
  },
  ".MuiCardHeader-action": {
    margin: 0,
  },
}));

const ViewRepliesButton = styled(CardActionArea)(({ theme }) => ({
  transition: "all 0.3s ease",
  backgroundColor: "rgba(0,0,0,0)",
  "&:hover , &:focus": {
    backgroundColor: "rgba(0,0,0,0)",
    textDecoration: "underline",
  },
  "& .MuiCardActionArea-focusHighlight": {
    display: "none",
  },
}));

export default function ParentComments({ postId, refreshKey }) {
  const [comments, setComments] = useState([]);
  const [showReplies, setShowReplies] = useState({});
  const [replyInput, setReplyInput] = useState(null);
  const [likedComments, setLikedComments] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const location = useLocation();
  const { parentId } = location.state || {};

  const { commentId } = location.state || {};

  const commentRefs = useRef({});

  const scrollToComment = (commentId) => {
    const el = commentRefs.current[commentId];

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 1500);
    }
  };

  useEffect(() => {
    if (commentId && comments.length > 0) {
      const isCommentPresent = comments.some(
        (comment) => comment.id === commentId
      );

      if (isCommentPresent) {
        setTimeout(() => {
          scrollToComment(commentId);
        }, 300);
      }
      if (parentId) {
        setShowReplies((prev) => ({
          ...prev,
          [parentId]: true,
        }));
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), 2000);
      }
    }
  }, [commentId, comments]);

  const fetchParentComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const parentComments = await axiosInstance.get(`/comment/${postId}`);
      const parentCommentsData = parentComments.data.data;

      const enrichedComments = await Promise.all(
        parentCommentsData.map(async (comment) => {
          try {
            const [avatarResponse, repliesResponse] = await Promise.all([
              axiosInstance.get(`/user/avatar/${comment.user.id}`, {
                responseType: "blob",
              }),
              axiosInstance.get(`/comment/replies/${comment.id}`),
            ]);

            return {
              ...comment,
              avatarUrl: avatarResponse.data
                ? URL.createObjectURL(avatarResponse.data)
                : null,
              hasReplies: repliesResponse.data.data.length > 0,
              repliesCount: repliesResponse.data.data.length,
            };
          } catch (error) {
            console.error("Error fetching comment details", error);
            return {
              ...comment,
              avatarUrl: null,
              hasReplies: false,
              repliesCount: 0,
            };
          }
        })
      );

      setComments(enrichedComments);
    } catch (error) {
      console.error("Error fetching parent comments", error);
      setError("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchParentComments();
  }, [fetchParentComments, postId, refreshKey, refreshTrigger]);

  const handleToggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleLike = (commentId) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleAddReply = (commentId) => {
    setReplyInput((prev) => (prev === commentId ? null : commentId));
  };

  const handleRefreshComments = () => {
    setRefreshTrigger((prev) => !prev);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          color: "error.main",
        }}
      >
        <Typography variant="h6">{error}</Typography>
        <Typography
          variant="body2"
          sx={{
            cursor: "pointer",
            mt: 1,
            textDecoration: "underline",
          }}
          onClick={fetchParentComments}
        >
          Retry
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Card
            key={comment.id}
            ref={(el) => {
              commentRefs.current[comment.id] = el;
            }}
            sx={{
              boxShadow: 0,
              mb: 2,
              transition: "all 0.3s ease",
              backgroundColor:
                commentId === comment.id && isHighlighted
                  ? "#fff59d"
                  : "inherit",
            }}
          >
            <StyledCardHeader
              sx={{ pb: 1 }}
              avatar={
                <Avatar
                  aria-label="avatar"
                  src={comment.avatarUrl}
                  sx={{
                    width: 30,
                    height: 30,
                    boxShadow: 2,
                  }}
                />
              }
              title={
                <UserHoverCard
                  username={comment.user.username}
                  userId={comment.user.id}
                />
              }
              subheader={formatDate(comment.createdAt)}
            />
            <CardContent sx={{ py: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  mx: 4,
                  pl: 1.75,
                  textAlign: "left",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {comment.content}
              </Typography>
            </CardContent>
            <CardActions sx={{ mx: 5.5 }}>
              <IconButton onClick={() => handleLike(comment.id)}>
                {!likedComments[comment.id] ? (
                  <FavoriteBorderIcon fontSize="small" />
                ) : (
                  <FavoriteIcon color="error" fontSize="small" />
                )}
              </IconButton>
              <IconButton onClick={() => handleAddReply(comment.id)}>
                <ChatBubbleOutlineIcon fontSize="small" sx={{ p: 0 }} />
              </IconButton>
            </CardActions>
            {replyInput === comment.id && (
              <CommentInput
                postId={postId}
                parentCommentId={comment.id}
                username={comment.user.username}
                onCommentadded={handleRefreshComments}
                onReplySend={() => setReplyInput(null)}
              />
            )}
            {comment.hasReplies && (
              <>
                <ViewRepliesButton
                  disableRipple
                  sx={{
                    width: {
                      xs: "64%",
                      sm: "52%",
                      md: "36%",
                      lg: "27%",
                      xl: "21.5%",
                    },
                    pl: 8,
                    py: 1,
                    textAlign: "left",
                  }}
                  onClick={() => handleToggleReplies(comment.id)}
                >
                  <Typography variant="body2">
                    {showReplies[comment.id]
                      ? "Hide replies"
                      : `View ${comment.repliesCount} ${
                          comment.repliesCount === 1 ? "reply" : "replies"
                        }`}
                  </Typography>
                </ViewRepliesButton>
                <Collapse
                  in={showReplies[comment.id]}
                  timeout={200}
                  unmountOnExit
                >
                  <Box
                    sx={{
                      ml: 2,
                      pb: 2,
                      display: "flex",
                      alignItems: "end",
                      flexDirection: "column",
                    }}
                  >
                    <ChildrenComments
                      parentId={comment.id}
                      childRefreshKey={refreshTrigger}
                      highlightId={commentId}
                      isHighlighting={isHighlighted}
                    />
                  </Box>
                </Collapse>
              </>
            )}
          </Card>
        ))
      ) : (
        <Box
          sx={{
            m: 2,
            height: "30vh",
            pt: 5,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No comments yet
          </Typography>
        </Box>
      )}
    </>
  );
}
