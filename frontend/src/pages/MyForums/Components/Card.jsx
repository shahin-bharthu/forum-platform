import * as React from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EditNoteIcon from '@mui/icons-material/EditNote';

export default function MediaCard({
  name,
  purpose,
  logo,
  createdBy,
  forumId,
  canSubscribe,
  onSubscribe,
  onViewDetails,
  myForum
}) {
  const token = useRouteLoaderData("user");

  let decodedToken = null;
  let currentUserId = null;
  if (token) {
    try {
      decodedToken = decodeToken(token);
      currentUserId = decodedToken ? decodedToken.id : null;
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 140 }} image={logo} title="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {purpose}
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small">Share</Button> */}
        <Button size="small" onClick={onViewDetails}>Learn More</Button>
        {myForum && (
          <EditNoteIcon fontSize="small" color='primary' onClick={onSubscribe}>
            Take Action
          </EditNoteIcon>
        )}
        {canSubscribe && (
          <Button size="small" onClick={onSubscribe}>
            Subscribe
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
