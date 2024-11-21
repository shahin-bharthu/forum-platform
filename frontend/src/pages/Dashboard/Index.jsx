import axios from "axios";
import Grid from '@mui/material/Grid2';
import RecentNewPostsCard from "./Components/RecentNewPostsCard";
import RecentNewForumsCard from "./Components/RecentNewForumsCard";
import { Typography } from "@mui/material";
import { useLoaderData } from "react-router-dom";

export default function Dashboard() {
    const { recentForumData,forumAvatar , empty } = useLoaderData()
    return (
        <>
            <Grid container spacing={6} size={12} direction="row" sx={{ width: '100%', px: 0, mx: 3, alignSelf: 'start' }}>

                <Grid size={{ xs: 12, md: 9 }} sx={{ mt: 10, alignSelf: 'start' }}>
                    <Typography fontWeight='fontWeightMedium' variant="body2" sx={{ m: 1, textAlign: "left", color: 'text.secondary' }}>
                        RECENT POSTS
                    </Typography>
                    <RecentNewPostsCard />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }} sx={{ mt: 10, alignSelf: 'start' }}>
                    <Typography fontWeight='fontWeightMedium' variant="body2" sx={{ m: 1, textAlign: "left", color: 'text.secondary' }}>
                        RECENT FORUMS
                    </Typography>
                    {empty && <p>No recent forums</p>}
                    {!empty && <RecentNewForumsCard recentForumData={recentForumData} forumAvatar={forumAvatar}/>}
                </Grid>
            </Grid>
        </>
    );
}

export async function dashboardLoader() {
    try {
        const recentForums = await axios.get('http://localhost:8080/forum/recent-forums', {
            withCredentials: true
        });
        const recentForumData = recentForums.data.data || [];

        const forumAvatar = await Promise.all(
            recentForumData.map(async (forum) => {
                try {
                    const avatarResponse = await axios.get(
                        `http://localhost:8080/forum/banner/${forum.forum_id}`,
                        {
                            withCredentials: true,
                            responseType: "blob",
                        }
                    )

                    if (avatarResponse.data) {
                        const avatarBlob = avatarResponse.data

                        return {
                            forumId: forum.forum_id,
                            avatarUrl: URL.createObjectURL(avatarBlob)
                        }
                    }
                }
                catch (error) {
                    console.error('Error fetching avatar', error)
                    return {
                        forumId: forum.forum_id,
                        avatarUrl: null
                    }
                }
            })
        )

        const empty = recentForumData.length === 0;

        return {
            recentForumData,
            forumAvatar,
            empty
        };

    } catch (error) {
        console.log(error.message);
        return {
            recentForumData: [],
            forumAvatar:[],
            empty: true
        };
    }
}