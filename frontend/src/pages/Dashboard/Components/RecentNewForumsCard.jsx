import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
    <>
      {recentForumData.map((forum) => (
        <Card key={forum.id} size={12} sx={{ width: '90%', my: 2 }}>
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
            <Box sx={{ justifyContent: 'center', width: '100%' }}>
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
            </Box>
          </CardActions>
        </Card>
      ))}
    </>
  );
}

