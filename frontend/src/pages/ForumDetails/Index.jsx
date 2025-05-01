import { useParams, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import ForumHeaderCard from "./Components/ForumHeaderCard";
import ForumInfoCard from "./Components/ForumInfoCard";
import ForumMainCard from "./Components/ForumMainCard";
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import axiosInstance from "../../../utils/axiosInstance";
import CircularProgress from '@mui/material/CircularProgress';

export default function IntroDivider() {
    const [forumDetails, setForumDetails] = useState();
    const [forumCreatedBy, setForumCreatedBy] = useState();
    const [isSubbed, setIsSubbed] = useState();
    const isPrivate = !(forumDetails?.isPublic);
    const isBlur = (isPrivate && !isSubbed);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        async function forumDetailsLoader(forum_id) {
            try {
                const response = await axiosInstance.get(`/forum/forum-id/${forum_id}`);
                const forumData = response.data.data;
                const forumCreatorData = await axiosInstance.get(`/user/${forumData.createdBy}`);
                
                setForumDetails(forumData);
                setForumCreatedBy(forumCreatorData.data.user.username);
            } catch (error) {
                console.log(error.message);
            }
        }

        forumDetailsLoader(params.forum_id).then(()=> {setLoading(false)});
    }, [params.forum_id]);
    
    return (
        loading ? <CircularProgress /> : 
        <>
            <Grid container spacing={3} direction="column" sx={{ px: 1, width:{ xs:'90%', sm:'95%',md:'80%'}, mt: 10, alignSelf: 'start' }}>
                <Grid size={12} sx={{ borderRadius: 2 }}>
                    <ForumHeaderCard forum={forumDetails} setIsSubbed={setIsSubbed} />
                </Grid>
                <Grid size={12} container spacing={2}>
                    <Grid size={{ xs: 12,sm:7, md: 8, lg:9, xl:9 }}
                        sx={{position:'relative'}}
                    >
                        <ForumMainCard
                            forum={forumDetails}
                            isSubbed={isSubbed}
                            isBlur={isBlur}
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
                    <Grid size={{ xs: 0,sm:5, md: 4, lg:3, xl:3}}>
                        <ForumInfoCard creator={forumCreatedBy} forum={forumDetails} />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}