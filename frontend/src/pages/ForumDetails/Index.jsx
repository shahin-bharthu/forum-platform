import axios from "axios";
import { useLoaderData, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import ForumHeaderCard from "./Components/ForumHeaderCard";
import ForumInfoCard from "./Components/ForumInfoCard";
import ForumMainCard from "./Components/ForumMainCard";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

export default function IntroDivider() {
    const { forumDetails, forumCreatedBy } = useLoaderData();
    const [postLength, setPostLength] = useState()
    const [isSubbed, setIsSubbed] = useState()
    const isPrivate = !(forumDetails.isPublic)
    const isBlur = (isPrivate && !isSubbed)
    const navigate=useNavigate();
    return (
        <>
            <Grid container spacing={3} direction="column" sx={{ px: 2, width: '80%', mt: 10, alignSelf: 'start' }}>
                <Grid size={12} sx={{ borderRadius: 2 }}>
                    <ForumHeaderCard forum={forumDetails} setIsSubbed={setIsSubbed} />
                </Grid>
                <Grid size={12} container spacing={2}>
                    <Grid size={{ xs: 12, md: 9 }}
                        sx={{position:'relative'}}
                    >
                        <ForumMainCard
                            forum={forumDetails}
                            setPostLength={setPostLength}
                            isSubbed={isSubbed}
                            style={isBlur ? {
                                opacity: 0.5,
                                pointerEvents: 'none',
                                filter: 'blur(20px)',
                                userSelect: 'none'
                            } : {}}
                        />
                        {isBlur &&
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 2,
                                    padding: '16px 24px',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Private Forum
                                </Typography>
                                <Typography variant="body1">
                                    Subscribe to view content
                                </Typography>
                                <Button onClick={()=>navigate('/user/dashboard')}>Home</Button>
                            </Box>
                        }
                    </Grid>
                    <Grid size={{ xs: 0, md: 3 }}>
                        <ForumInfoCard creator={forumCreatedBy} forum={forumDetails} postLength={postLength} />
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