import {useEffect, useState} from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton, Tooltip } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArchiveIcon from '@mui/icons-material/Archive';
import InfoIcon from '@mui/icons-material/Info';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import axiosInstance from '../../../../utils/axiosInstance';

export default function MediaCard({
  id,
  name,
  purpose,
  canSubscribe,
  onSubscribe,
  onViewDetails,
  myForum, 
  onEditForum,
  isArchived,
  onArchive
  }) {
  const token = useRouteLoaderData("user");
  const [bannerUrl, setBannerUrl] = useState();

  useEffect(() => {
    const fetchAvatar = async () => {
      const data = await handleFileRead();
    };

    fetchAvatar().catch(console.error);
  }, []);

  const handleFileRead = async () => {
    const file = await axiosInstance.get(`/forum/banner/${id}`, {responseType: "blob"});

    if (file.data) {
      // setBanner(file.data);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result);
      };
      reader.readAsDataURL(file.data);
    }
  };

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
      <CardMedia sx={{ height: 140 }} image={bannerUrl || "https://blog.cengage.com/wp-content/uploads/2023/11/tl-discussion-boards-1551827-1024x351.png"} title={name} />
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
          {isArchived && 
          <Tooltip title="Unarchive Forum">
            <IconButton color="primary" aria-label="un-archive" onClick={onArchive}>
              <UnarchiveIcon />
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
