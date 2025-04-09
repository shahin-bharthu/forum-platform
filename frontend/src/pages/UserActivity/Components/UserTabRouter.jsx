import UserPosts from "./UserPosts";
import UserComments from "./UserComments";
import LikedPosts from "./LikedPosts";
import UserOverview from "./UserOverview";

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
        return <h1>Invalid Tab</h1>;
  }
};

export default UserTabRouter;
