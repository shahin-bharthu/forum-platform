// import axios from "axios";
import { useLoaderData, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import ForumInfoCard from "../ForumDetails/Components/ForumInfoCard";
import PostDetailsCard from "./Components/PostDetailsCard";
// import { useState } from "react";
// import { Box, Button, Typography } from "@mui/material";


export default function PostDetails() {
    // const { forumDetails, forumCreatedBy } = useLoaderData();
    // const [postLength, setPostLength] = useState()
    // const [isSubbed, setIsSubbed] = useState()
    // const isPrivate = !(forumDetails.isPublic)
    // const isBlur = (isPrivate && !isSubbed)
    // const navigate=useNavigate();
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
        <>
            {/* <Grid container spacing={3} direction="column" sx={{ px: 2, width: '80%', mt: 10, alignSelf: 'start' }}> */}
            {/* <Grid size={12} sx={{ borderRadius: 2 }}>
                    {/* <ForumHeaderCard forum={forumDetails} setIsSubbed={setIsSubbed} /> */}
            {/* <h1>he</h1> */}
            {/* </Grid> */}
            <Grid size={12} container spacing={3} sx={{ px: 3, width: '100%', mt: 10, alignSelf: 'start' }}>
                <Grid size={{ xs: 12, sm: 7, md: 9 }}
                    sx={{ position: 'relative' }}
                >
                    <PostDetailsCard/>
                </Grid>
                <Grid size={{ xs: 0,sm:5, md: 3 }}>
                    <ForumInfoCard creator={forumCreatedBy} forum={forumDetails} postLength={postLength} />
                </Grid>
            </Grid>
            {/* </Grid> */}
        </>
    );
}

