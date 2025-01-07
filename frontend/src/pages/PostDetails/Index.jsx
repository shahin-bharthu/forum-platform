import { useLoaderData } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import ForumInfoCard from "../ForumDetails/Components/ForumInfoCard";
import PostDetailsCard from "./Components/PostDetailsCard";
import axiosInstance from "../../../utils/axiosInstance";


export default function PostDetails() {
    const { topic, forum, user, forum_creator } = useLoaderData()
    const forumCreatedBy = 'test'
    const postLength = 2
    const forumDetails = {
        createdAt: "2024-11-18T09:36:46.000Z",
        createdBy: "666a9bc9-3ded-41fb-bf3a-3666c0d570ab",
        forum_id: "kotlin",
        id: "30cbe418-1f90-4f8c-a7ab-c0e38bf986d4",
        isActive: true,
        isPublic: false,
        logo: "forumLogos\\30cbe418-1f90-4f8c-a7ab-c0e38bf986d4-Kotlin.jpg",
        name: "Kotlin",
        purpose: "Kotlin is a cross-platform, statically typed, general-purpose high-level programming language with type inference. Kotlin is designed to interoperate fully with Java",
        subscriber_count: 3,
        updatedAt: "2024-11-21T17:19:53.000Z"
    }
    return (
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


export const postDetailsLoader = async ({ params }) => {
    const { id } = params;
    const postDetails = await axiosInstance.get(`/topic/${id}`);

    return {
        topic: postDetails.data.data.topic,
        forum: postDetails.data.data.forum,
        user: postDetails.data.data.user,
        forum_creator: postDetails.data.data.forum_creator.username
    };
}