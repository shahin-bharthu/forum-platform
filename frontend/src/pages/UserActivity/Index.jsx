import { useState, useEffect, memo } from "react";
import UserActivityHeader from "./Components/UserActivityHeader";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid2 as Grid } from "@mui/material";
import ActivityTabs from "./Components/ActivityTabs";
import { Outlet, useLoaderData, useParams } from "react-router-dom";
import UserInfo from "./Components/UserInfo";
import {
  clearUserActivity,
  setUserActivity,
} from "../../store/slices/userActivitySlice";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import CircularSpinner from "../../components/CircularSpinner";
import UserTabRouter from "./Components/UserTabRouter";


export default function UserActivity() {
  const {tab} = useLoaderData() || "overview";
  const userActivity = useSelector((state) => state.userActivity);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const { username } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    async function userActivityLoader(username) {
        try {
          dispatch(clearUserActivity());
          const userDetails = await axios.get(
            `http://localhost:8080/user/profile/${username}`,
            { withCredentials: true }
          );
                    
          const userAvatar = await axios.get(`http://localhost:8080/user/avatar/${userDetails.data.data.user.id}`,{responseType: "blob", withCredentials: true});
          const userAvatarUrl = URL.createObjectURL(userAvatar.data);
          const userDetailsData = {
            ...userDetails.data.data,
            profilePhoto: userAvatarUrl,
          };
          dispatch(setUserActivity(userDetailsData));
        } catch (error) {
          console.log(error.message);
        }
    }
    userActivityLoader(username).then(() => setLoading(false));
  }, [dispatch]);

  const dummyForum = {
    forum_id: "123",
    name: "Tech Innovations Forum",
    purpose: "A place to discuss the latest tech innovations and trends.",
    createdAt: "2024-01-15T10:30:00Z",
    isPublic: true,
    subscriber_count: 1500,
  };

  const dummyCreator = "Jane Doe";

  const dummyPostLength = 120; // Number of posts

  const dummySetIsPrivate = (isPrivate) => {
    console.log("Is forum private:", isPrivate);
  };

  if (loading) {
    return <CircularSpinner />;
  } else {
    return (
      <Container
        sx={{
          px: 1,
          width: { xs: "90%", sm: "95%", md: "80%" },
          mt: 10,
          alignSelf: "start",
        }}
      >
        <Grid container size={12} spacing={2}>
          <Grid
            size={{ xs: 12, sm: 7, md: 8, lg: 9, xl: 9 }}
            sx={{ position: "relative" }}
          >
            <UserActivityHeader
              username={userActivity?.userDetails?.username || "Your Username"}
              name={`${userActivity?.userDetails?.firstname} ${userActivity?.userDetails?.lastname}`}
              avatarUrl={userActivity.profilePhoto}
            />
            <Grid item xs={12} sx={{ mt: 3 }}>
              <ActivityTabs isCurrentUser={userActivity.isCurrentUser} />
              <UserTabRouter tab={tab} />
            </Grid>
          </Grid>
          <Grid size={{ xs: 0, sm: 5, md: 4, lg: 3, xl: 3 }}>
            <UserInfo
              user={`${userActivity?.userDetails?.firstname} ${userActivity?.userDetails?.lastname}`}
              userDoj={userActivity.userDetails.createdAt}
              forumsCreated={userActivity.isCurrentUser? userActivity.userForums.publicForums :userActivity.userForums.publicUserForums}
              postLength={userActivity.userPosts.length}
              commentlength={userActivity.userComments.length}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }
}


