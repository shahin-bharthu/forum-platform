import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import ForumInfoCard from "../ForumDetails/Components/ForumInfoCard";
import PostDetailsCard from "./Components/PostDetailsCard";
import axiosInstance from "../../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

export default function PostDetails() {
    const [topic, setTopic] = useState();
    const [forum, setForum] = useState();
    const [user, setUser] = useState();
    const [forum_creator, setForumCreator] = useState();
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        const postDetailsLoader = async (id) => {
            const postDetails = await axiosInstance.get(`/topic/${id}`);
            setTopic(postDetails.data.data.topic);
            setForum(postDetails.data.data.forum);
            setUser(postDetails.data.data.user);
            setForumCreator(postDetails.data.data.forum_creator.username);
        }

        postDetailsLoader(params.id).then(() => setLoading(false));
    }, [params.id]);

    return (
        loading ? <CircularProgress/> :
        <Grid size={12} container spacing={3} sx={{ px: 3, width: '100%', mt: 10, alignSelf: 'start' }}>
            <Grid size={{ xs: 12, sm: 7, md: 8, lg: 9, xl: 9 }}
                sx={{ position: 'relative' }}
            >
                <PostDetailsCard post={topic} user={user} forum={forum} />
            </Grid>
            <Grid size={{ xs: 0, sm: 5, md: 4, lg: 3, xl: 3 }}>
                <ForumInfoCard creator={forum_creator} forum={forum} />
            </Grid>
        </Grid>
    );
}