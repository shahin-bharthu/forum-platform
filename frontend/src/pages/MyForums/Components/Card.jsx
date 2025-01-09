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
        <Skeleton variant="circular" width={24} height={24}/>
        <Skeleton variant="circular" width={24} height={24}/>
        <Skeleton variant="circular" width={24} height={24}/>

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
        {/* {[1, 2, 3,4].map((_, index) => ( */}
          {/* <Grid key={index} size={{ xs: 6, sm: 6, md: 12 }}          > */}
            <ForumCardSkeleton />
          {/* </Grid> */}
        {/* ))} */}
      </Grid>
    );
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
