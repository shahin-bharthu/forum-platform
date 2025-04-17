import UserPosts from "./UserPosts";
import UserComments from "./UserComments";
import LikedPosts from "./LikedPosts";
import UserOverview from "./UserOverview";
import { CircularProgress } from "@mui/material";

const UserTabRouter = ({tab}) => {
  switch (tab) {
    case "posts":
      return <UserPosts />;
    case "comments":
      return <UserComments />;
    case "liked":
      return <LikedPosts />;
    case "overview": 
        return <UserOverview />;
    default:
        return <CircularProgress sx={{mt: 15}}/>;
  }
};

export default UserTabRouter;
