import { useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../utils/timestamp";
import { Tooltip, Typography } from "@mui/material";
import { FavoriteRounded } from "@mui/icons-material";
import { renderHTML } from "../../PostDetails/Components/CodeBlockViewer";


export default function LikedPosts() {
  const { likedPosts } = useSelector((state) => state.userActivity);  
  const navigate = useNavigate();

  return (
    <>
    {likedPosts?.length === 0 ? 
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
        You have not liked any posts yet<br />
      </Typography>  
      :
      <List sx={{ width: "100%" }}>
        {likedPosts.map((post) => {
          return (
            <>
              <ListItem
                alignItems="flex-start"
                sx={{ bgcolor: "background.paper", borderRadius: 5, my: 1 }}
              >
                <ListItemText
                  sx={{ cursor: "pointer", wordBreak: "break-word", mx: "0" }}
                  primary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color: "#414141",
                          display: "inline",
                          fontWeight: "450",
                          fontSize: "16px",
                        }}
                        onClick={() =>
                          navigate(`/post/${post.topic_id}`)
                        }
                      >
                        {post.topic.title} <br />
                      </Typography>
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
                      onClick={() => navigate(`/post/${post.topic_id}`)}
                    >
                      <Typography
                        component="span"
                        variant="subtitle1"
                        sx={{
                          color: "#414141",
                          display: "inline",
                          fontSize: "13px",
                        }}
                      >
                        {renderHTML(post.topic.content)} <br />
                      </Typography>
                      <span style={{ fontSize: "12px", display: "flex", alignItems: "center", marginTop: "5px" }}>
                        <FavoriteRounded sx={{width: 18, height: 16}}/>
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
                            &nbsp; Liked {formatDate(post.createdAt)} {formatDate(post.createdAt) ==='just now' ? '' : 'ago'}
                        </Tooltip>
                      </span>
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
