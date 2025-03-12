import { useState } from "react";
import UserActivityHeader from "./Components/UserActivityHeader";
import { useDispatch } from "react-redux";
import { Container, Grid2 as Grid, Typography } from "@mui/material";
import ActivityTabs from "./Components/ActivityTabs";
import { Outlet } from "react-router-dom";
import UserInfo from "./Components/UserInfo";

export default function UserActivity() {
  const [userActivity, setUserActivity] = useState([]);
  const [empty, setEmpty] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() => {
  //     async function userActivityLoader() {
  //         try {
  //             const userActivity = await axiosInstance.get('/user/activity');
  //             const userActivityData = userActivity.data.data || [];

  //             setUserActivity(userActivityData);
  //             setEmpty(userActivityData.length === 0);
  //         } catch (error) {
  //             console.log(error.message);
  //         }
  //     }

  //     userActivityLoader();
  // }, [dispatch]);

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
          <UserActivityHeader />
          <Grid item xs={12} sx={{ mt: 3 }}>
            <ActivityTabs />
          </Grid>
        </Grid>
        <Grid size={{ xs: 0,sm:5, md: 4, lg:3, xl:3}}>
          <UserInfo
            forum={dummyForum}
            creator={dummyCreator}
            postLength={dummyPostLength}
            setIsPrivate={dummySetIsPrivate}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
