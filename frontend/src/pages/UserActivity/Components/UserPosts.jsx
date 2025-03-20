import { useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { renderHTML } from "../../PostDetails/Components/CodeBlockViewer";
import { formatDate } from "../../../../utils/timestamp";

export default function UserPosts() {
  const { userPosts } = useSelector((state) => state.userActivity);
  const navigate = useNavigate();

  return (
    <>
      <List sx={{ width: "100%" }}>
        {userPosts.map((post) => {
            return (
              <>
                <ListItem
                  alignItems="flex-start"
                  sx={{ bgcolor: "background.paper", borderRadius: 5, my: 1 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{border: "0.5px solid rgba(50, 56, 53, 0.18)"}} alt={post.title} src="https://images.pexels.com/photos/31100755/pexels-photo-31100755/free-photo-of-modern-architectural-design-in-villefranche-sur-saone.jpeg" />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ cursor: "pointer", wordBreak: "break-word"}}
                    onClick={() => navigate(`/post/${post.id}`)}
                    primary={`${post.title} • ${ formatDate(post.createdAt)} ago`}
                    secondary={renderHTML(post.content)}
                  />
                </ListItem>
              </>
            );
          })
        }
      </List>
    </>
  );
}