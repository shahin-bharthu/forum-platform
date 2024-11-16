import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Stack, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export default function ForumHeaderCard({ forum }) {
  const navigate=useNavigate()
  return (
    <Card sx={{ width: '100%' }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="100"
        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJmEl5gk6MOADiLcjX04ablq3EGntiGWrI3A&s"
        sx={{ borderRadius: 1 }}
      />
      <Stack spacing={2} direction="row" sx={{ justifyContent: 'space-between', width: '100%' }}>
        <CardContent>
          <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
            <Avatar
              alt="Remy Sharp"
              src={forum.logo}
              sx={{ width: 60, height: 60, border: 3, borderColor: 'primary.main' }}
            />
            <Typography variant="h4" component="div" >
              {forum.name}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ pr: 4 }}>
          <Tooltip title="Create Post" arrow>
            <Button
              onClick={()=>navigate('/user/create-post')}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ borderRadius: 28, border: 2 }}
              disableElevation
              size="small"
            >
              Create
            </Button>
          </Tooltip>

          <Tooltip title="Unsubscribe" arrow>
            <Button
              // onClick={handleCreatePost}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 28, border: 2 }}
              disableElevation
            >
              Subscribed
            </Button>
          </Tooltip>
        </CardActions>
      </Stack>
    </Card>
  );
}
