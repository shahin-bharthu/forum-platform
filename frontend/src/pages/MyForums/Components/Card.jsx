import * as React from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton, Stack, Tooltip } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArchiveIcon from '@mui/icons-material/Archive';
import InfoIcon from '@mui/icons-material/Info';

export default function MediaCard({
  name,
  purpose,
  logo,
  canSubscribe,
  onSubscribe,
  onViewDetails,
  myForum, 
  onEditForum,
  isArchived,
  onArchive
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
    <Card sx={{ maxWidth: 345, height: 300 }}>
      <CardMedia sx={{ height: 140 }} image={logo} title="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{width:'90%',textOverflow:'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', px: 2}}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" , width:'90%',textOverflow:'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', display:'inline-block', px: 2}}>
          {purpose}
        </Typography>
      </CardContent>
      <CardActions sx={{justifyContent: 'right'}}>
        {/* <Stack spacing={2} direction="row" sx={{justifyContent: 'right'}}> */}
        <Tooltip title="Learn More">
          <IconButton color="primary" aria-label="info-icon" onClick={onViewDetails}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
        {myForum && (
          <>
          <Tooltip title="Edit Forum">
            <IconButton color="primary" aria-label="edit-note" sx={{'& .MuiCardActions-root': {ml: 0}}} onClick={onEditForum}>
              <EditNoteIcon />
            </IconButton>
          </Tooltip>
          {!isArchived && 
          <Tooltip title="Archive Forum">
            <IconButton color="primary" aria-label="archive" onClick={onArchive}>
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
          }
          </>
        )}
        {/* </Stack> */}
        {canSubscribe && (
          <Button size="small" onClick={onSubscribe}>
            Subscribe
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
