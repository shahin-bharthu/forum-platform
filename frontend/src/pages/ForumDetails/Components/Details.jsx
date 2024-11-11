import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useLoaderData } from "react-router-dom";

export default function IntroDivider() {
  const {forumDetails, forumCreatedBy} = useLoaderData();
  return (
    <Card variant="outlined" sx={{ maxWidth: 360 }}>
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
          {/* <Chip label="Medium" size="small" />
          <Chip label="Hard" size="small" /> */}
        </Stack>
      </Box>
    </Card>
  );
}


export async function forumDetailsLoader({request, params}) {
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
      withCredentials: true,}
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