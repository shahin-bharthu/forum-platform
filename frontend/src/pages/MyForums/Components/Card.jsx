import {useEffect, useState, memo} from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardHeader, Grid2 as Grid, IconButton, Skeleton, Stack, styled, Tooltip } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArchiveIcon from '@mui/icons-material/Archive';
import InfoIcon from '@mui/icons-material/Info';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import axiosInstance from '../../../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import defaultForumBanner from '../../../assets/defaultForumbanner.png';

const StyledCardHeader = memo(styled(CardHeader)`
  display: flex;
  justify-content: center;
  padding: 10px 16px;
  
  .MuiCardHeader-content {
    display: none;
  }
  
  .MuiCardHeader-action {
    display: none;
  }
  
  .MuiCardHeader-avatar {
    margin: 0;
  }
`);

const ForumCardSkeleton = memo(() => (
  <Card sx={{ width: '100%', my: 2 }}>
    <StyledCardHeader
      avatar={
        <Skeleton
          variant="rectangular"
          width={225}
          height={150}
          animation="wave"
        />
      }
    />
    <CardContent sx={{ py: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="90%" height={20} />
    </CardContent>
    <CardActions>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'end',
          width: '100%',
          alignItems: 'center'
        }}
      >
        <Skeleton variant="rounded" width={75} height={24}/>
        {/* <Skeleton variant="circular" width={24} height={24}/> */}
      </Stack>
    </CardActions>
  </Card>
));

ForumCardSkeleton.displayName = 'ForumCardSkeleton';


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
  const [isHovered, setIsHovered] = useState(false);
  const isLoading = useSelector(state => state.loading.isLoading);

  useEffect(() => {
    const fetchAvatar = async () => {
      await handleFileRead();
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

  if (isLoading) {
    return (
      <Grid container spacing={2}>
          <ForumCardSkeleton />
      </Grid>
    );
  }

  return (
    <Card sx={{ maxWidth: 345, height: 270, transition: "transform 0.3s", transform: isHovered ? 'scale(1.03)' : 'scale(1)' , boxShadow: isHovered ? "0 0 10px rgba(0, 0, 0, 0.3)" : "none", borderRadius: 3 }}>
      <CardMedia sx={{ height: 140, cursor: "pointer" }} image={bannerUrl || defaultForumBanner } title={name} onClick={onViewDetails} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} />
      <CardContent sx={{cursor: "pointer", paddingBottom: '0px'}} onClick={onViewDetails} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Tooltip title={name} placement="top" >
        <Typography gutterBottom variant="h6" component="div" sx={{width:'100%',textOverflow:'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', px: 2}}>
          {name}
        </Typography>
        </Tooltip>
        <Typography variant="body2" sx={{ color: "text.secondary" , width:'90%',textOverflow:'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', display:'inline-block', px: 2}}>
          {purpose}
        </Typography>
      </CardContent>
      <CardActions sx={{justifyContent: 'right', padding: '0px 8px 0px 8px'}}>
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
        {canSubscribe && (
          <Button size="small" onClick={onSubscribe}>
            Subscribe
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
