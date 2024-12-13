import { memo, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { Grid2 as Grid, Stack, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PublicIcon from '@mui/icons-material/Public';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import Tooltip from '@mui/material/Tooltip';

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
          variant="circular"
          width={75}
          height={75}
          animation="wave"
        />
      }
    />
    <CardContent sx={{ py: 0 }}>
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="90%" height={20} />
    </CardContent>
    <CardActions>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'center',
          width: '100%',
          alignItems: 'center'
        }}
      >
        <Skeleton
          variant="rectangular"
          width="70%"
          height={36}
          sx={{ borderRadius: 1 }}
        />
        <Skeleton
          variant="circular"
          width={24}
          height={24}
        />
      </Stack>
    </CardActions>
  </Card>
));


export default function RecentNewForumsCard({ recentForumData = [], isLoading = false }) {
  const navigate = useNavigate()
  
  const handleViewDetails = useCallback((event, forum_id) => {    
    event.preventDefault();
    navigate(`/forum/${forum_id}`);
  }, [navigate]);


  if (isLoading ) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3].map((_, index) => (
          <Grid key={index} xs={12} sm={6} md={12}>
            <ForumCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }


  return (
    // <>
    <Grid size={{ md: 12 }} direction="row">
      {recentForumData.map((forum) => (
        <Card key={forum.id} size={12} sx={{ width: '100%', my: 2 }}>
          <StyledCardHeader
            avatar={
              <Avatar
                aria-label="Forum Banner"
                src={forum.avatarUrl}
                sx={{ width: 75, height: 75 }}>
                {forum.name}
              </Avatar>
            }
          />
          <CardContent sx={{ py: 0 }}>
            <Typography gutterBottom variant="body1" component="div" fontWeight='fontWeightMedium'>
              {forum.name}
            </Typography>
            <Typography gutterBottom variant="body2" sx={{ color: "text.secondary", width: '90%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', display: 'inline-block', px: 2 }}>
              {forum.purpose}
            </Typography>
          </CardContent>
          <CardActions>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', width: '100%' }}>
              <Button
                size="small"
                variant='contained'
                color="primary"
                sx={{ width: '70%' }}
                onClick={(event) =>
                  handleViewDetails(event, forum.forum_id)
                }
              >
                View
              </Button>
              {forum.isPublic === false ? <Tooltip title="Private" arrow><VpnLockIcon sx={{ alignSelf: 'center' }} /></Tooltip> : <Tooltip title="Public" arrow><PublicIcon sx={{ alignSelf: 'center' }} /></Tooltip>}
            </Stack>
          </CardActions>
        </Card>
      ))}
    </Grid>
  );
}

