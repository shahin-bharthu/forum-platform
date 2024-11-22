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
    const [isSubbed,setIsSubbed]=useState()
    const isPrivate=!(forumDetails.isPublic)
    const isBlur=(isPrivate && !isSubbed)    
        
    return (
        <>
            <Grid container spacing={3} direction="column" sx={{ px: 2, width: '80%', mt: 10 , alignSelf: 'start'}}>
                <Grid size={12} sx={{ borderRadius: 2 }}>
                    <ForumHeaderCard forum={forumDetails} setIsSubbed={setIsSubbed} />
                </Grid>
                <Grid size={12} container spacing={2}>
                    <Grid size={{ xs: 12, md: 9 }}>
                        <ForumMainCard forum={forumDetails} setPostLength={setPostLength} isSubbed={isSubbed} isBlur={isBlur}/>
                    </Grid>
                    <Grid size={{ xs: 0, md: 3 }}>
                        <ForumInfoCard creator={forumCreatedBy} forum={forumDetails} postLength={postLength}/>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}


export async function forumDetailsLoader({ request, params }) {
    const forum_id = params.forum_id;
    // console.log(forum_id);
    
    try {
        const response = await axios.get(`http://localhost:8080/forum/forum-id/${forum_id}`, {
            withCredentials: true,
        });
        const forumData = response.data.data;
        // console.log(response);

        const forumCreatorId = forumData.createdBy;
        const forumCreatorData = await axios.get(
            `http://localhost:8080/user/${forumCreatorId}`, {
            withCredentials: true,
        }
        );

        // console.log(forumCreatorData.data.user.username);

        return {
            forumDetails: forumData,
            forumCreatedBy: forumCreatorData.data.user.username,
            // empty: !response.data.data || response.data.data.length === 0,
        };
    } catch (error) {
        console.log(error.message);
    }
}


     {/* <Card variant="outlined" sx={{ maxWidth: 360 }}>
                <Box sx={{ p: 2 }}>
                    <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", alignItems: "center" }}
                    >
                    <Typography gutterBottom variant="h5" component="div">
                        {forumDetails.name}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {forumDetails.subscriber_count}
                    </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {forumDetails.purpose}
                    </Typography>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <Typography gutterBottom variant="body2">
                    Created By
                    </Typography>
                    <Stack direction="row" spacing={1}>
                    <Chip color="primary" label={forumCreatedBy} size="small" />
                    </Stack>
                </Box>
                </Card> */}