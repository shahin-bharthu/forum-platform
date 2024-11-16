import axios from "axios";
import { useLoaderData } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import ForumHeaderCard from "./Components/ForumHeaderCard";
import ForumInfoCard from "./Components/ForumInfoCard";
import ForumMainCard from "./Components/ForumMainCard";

export default function IntroDivider() {
    const { forumDetails, forumCreatedBy } = useLoaderData();
    return (
        <>
            <Grid container spacing={3} direction="column" sx={{ px: 2, width: '80%', mt: 10 }}>
                <Grid size={12} sx={{ borderRadius: 2 }}>
                    <ForumHeaderCard forum={forumDetails} />
                </Grid>
                <Grid size={12} container spacing={2}>
                    <Grid size={{ xs: 12, md: 9 }}>
                        <ForumMainCard forum={forumDetails}/>
                    </Grid>
                    <Grid size={{ xs: 0, md: 3 }}>
                        {/* xs=6 md=4 */}
                        <ForumInfoCard creator={forumCreatedBy} forum={forumDetails}/>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}


export async function forumDetailsLoader({ request, params }) {
    const forum_id = params.forum_id;
    try {
        const response = await axios.get(`http://localhost:8080/forum/${forum_id}`, {
            withCredentials: true,
        });
        const forumData = response.data.data;
        // console.log(forumData);

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