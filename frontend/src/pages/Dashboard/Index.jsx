import Grid from '@mui/material/Grid2';
import RecentNewPostsCard from "./Components/RecentNewPostsCard";
import RecentNewForumsCard from "./Components/RecentNewForumsCard";
import { Typography } from "@mui/material";
import axiosInstance from "../../../utils/axiosInstance";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecentForums } from '../../store/dashboardSlice';

export default function Dashboard() {
    const recentForums = useSelector(state => state.dashboard.recentForums);
    const [empty, setEmpty] = useState(false);
    const dispatch = useDispatch();
    
    useEffect(() => {
        async function dashboardLoader() {
            try {
                const recentForums = await axiosInstance.get('/forum/recent-forums');
                const recentForumData = recentForums.data.data || [];

                const forumAvatar = await Promise.all(
                    recentForumData.map(async (forum) => {
                        try {                    
                            const avatarResponse = await axiosInstance.get(
                                `http://localhost:8080/forum/banner/${forum.id}`,
                                {
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
                
                const enrichedForumData = recentForumData.map(forum => {
                    const avatarInfo = forumAvatar.find(b => b.forumId === forum.forum_id);
                    return {
                        ...forum,
                        avatarUrl: avatarInfo?.avatarUrl
                    };
                });
                
                setEmpty(enrichedForumData.length === 0);
                dispatch(setRecentForums(enrichedForumData));

            } catch (error) {
                console.log(error.message);
            }
        }

        dashboardLoader();
    }, [dispatch]);
    
    return (
        <>
            <Grid container spacing={{xs:1,md:5}} size={12} direction="row" sx={{ width: '100%', px: 0, mx: 3, alignSelf: 'start' }}>

                <Grid size={{ xs: 12, md: 9 }} sx={{ mt: 10, alignSelf: 'start' }}>
                    <Typography fontWeight='fontWeightMedium' variant="body2" sx={{ mb:2,mt: 1, mx:1, textAlign: "left", color: 'text.secondary' }}>
                        RECENT POSTS
                    </Typography>
                    <RecentNewPostsCard />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }} sx={{ mt: 10, alignSelf: 'start' }}>
                    <Typography fontWeight='fontWeightMedium' variant="body2" sx={{ m: 1, textAlign: "left", color: 'text.secondary' }}>
                        RECENT NEW FORUMS
                    </Typography>
                    {empty && <Typography sx={{textAlign: 'left', ml: 1}}>No recent forums</Typography>}
                    {!empty && <RecentNewForumsCard recentForumData={recentForums} />}
                </Grid>
            </Grid>
        </>
    );
}