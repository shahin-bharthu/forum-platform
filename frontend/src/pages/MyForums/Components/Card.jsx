import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouteLoaderData } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import axios from 'axios';

export default function MediaCard({name, purpose, logo, createdBy, forumId}) {
  const token = useRouteLoaderData('user');

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

  // Check if the current user is not the creator of the forum
  const canSubscribe = currentUserId && currentUserId !== createdBy;

  const handleSubscribe = async (event) => {
    event.preventDefault();
    console.log("in handle subscribe");

    try {
      const response = await axios.post(`http://localhost:8080/forum/subscribe/${forumId}`, {
        "Content-Type": "application/json",
        withCredentials: true
      })
      console.log(response);
    } catch (error) {
      console.error("Error: ", error);
      // setErrorMessage(error.response.data.message || "An error occurred. Please try again later.");
    }
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={logo}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {purpose} {decodedToken.email}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
        {canSubscribe && <Button size="small" onClick={handleSubscribe}>Subscribe</Button>}
      </CardActions>
    </Card>
  );
}
