import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import {Grid2, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PublicIcon from '@mui/icons-material/Public';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import Tooltip from '@mui/material/Tooltip';

const StyledCardHeader = styled(CardHeader)`
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
`;
export default function RecentNewForumsCard({ recentForumData }) {  
  const navigate=useNavigate()
  const handleViewDetails = (event, forum_id) => {    
    event.preventDefault();
    navigate(`/forum/${forum_id}`);
  }

  return (
    // <>
      <Grid2  size={{ md: 12 }} direction="row">
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
                {forum.isPublic === false ? <Tooltip title="Private" arrow><VpnLockIcon sx={{alignSelf:'center'}} /></Tooltip> : <Tooltip title="Public" arrow><PublicIcon sx={{alignSelf:'center'}}/></Tooltip>}
              </Stack>
            </CardActions>
          </Card>
        ))}
      </Grid2>
  );
}

