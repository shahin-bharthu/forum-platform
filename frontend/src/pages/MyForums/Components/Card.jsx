import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouteLoaderData } from 'react-router-dom';
import { decodeToken } from "react-jwt";

export default function MediaCard({
  name,
  purpose,
  logo,
  createdBy,
  forumId,
  canSubscribe,
  onSubscribe,
  onViewDetails
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
        {canSubscribe && (
          <Button size="small" onClick={onSubscribe}>
            Subscribe
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
