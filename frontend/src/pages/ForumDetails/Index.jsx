import axios from "axios";
import { useLoaderData } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import ForumHeaderCard from "./Components/ForumHeaderCard";
import ForumInfoCard from "./Components/ForumInfoCard";
import ForumMainCard from "./Components/ForumMainCard";
import { useState } from "react";

export default function IntroDivider() {
    const { forumDetails, forumCreatedBy } = useLoaderData();
    const [postLength,setPostLength]=useState()

    return (
        <>
            <Grid container spacing={3} direction="column" sx={{ px: 2, width: '80%', mt: 10 , alignSelf: 'start'}}>
                <Grid size={12} sx={{ borderRadius: 2 }}>
                    <ForumHeaderCard forum={forumDetails} />
                </Grid>
                <Grid size={12} container spacing={2}>
                    <Grid size={{ xs: 12, md: 9 }}>
                        <ForumMainCard forum={forumDetails} setPostLength={setPostLength} />
                    </Grid>
                    <Grid size={{ xs: 0, md: 3 }}>
                        {/* xs=6 md=4 */}
                        <ForumInfoCard creator={forumCreatedBy} forum={forumDetails} postLength={postLength}/>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}


export async function forumDetailsLoader({ request, params }) {
    const forum_id = params.forum_id;
    
    try {
        const response = await axios.get(`http://localhost:8080/forum/forum-id/${forum_id}`, {
            withCredentials: true,
        });
        const forumData = response.data.data;

        const forumCreatorId = forumData.createdBy;
        const forumCreatorData = await axios.get(
            `http://localhost:8080/user/${forumCreatorId}`, {
            withCredentials: true,
        }
        );


        return {
            forumDetails: forumData,
            forumCreatedBy: forumCreatorData.data.user.username,
            // empty: !response.data.data || response.data.data.length === 0,
        };
    } catch (error) {
        console.log(error.message);
    }
}