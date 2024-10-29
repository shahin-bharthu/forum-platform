import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import MediaCard from './Components/Card';
import axios from 'axios';
import { useLoaderData, useNavigate } from "react-router-dom";
import { Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import Fab from '@mui/material/Fab';
// import AddIcon from '@mui/icons-material/Add';

export function FloatingActionButtons({onClick}) {
  return (
    <Box sx={{ 
      position: 'fixed',
      bottom: 20,
      right: 20,
      '& > :not(style)': { m: 0.5 } 
    }}>
      <Fab color="primary" aria-label="add" onClick={onClick} >
        <AddIcon />
      </Fab>
    </Box>
  );
}
export default function MyForum() {

  const { forums, empty } = useLoaderData();
  const navigate=useNavigate()
  const handleCreate=()=>{
    navigate('/user/add-forum')
  }

  if (empty) {
    return (
      <>
      <Box>
        <h3>No forums found</h3>
        <p>Create your first forum to get started</p>
      </Box>
      <FloatingActionButtons onClick={handleCreate}/>
      </>
    );
  }
  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 3, sm: 8, md: 12 }} sx={{ mx: 3, py: 11, justifyContent: 'center', alignContent: 'center' }}>
        {forums.map((forum) => (
          <Grid key={forum.id} size={{ xs: 2, sm: 3, md: 3 }}>
            <MediaCard name={forum.name} purpose={forum.purpose} logo={forum.logo} />
          </Grid>
        ))}
      </Grid>
    </Box>
    <FloatingActionButtons onClick={handleCreate}/>
    </>
  )
}

export async function forumLoader() {
  try {
    const response = await axios.get('http://localhost:8080/forum/my-forums', {
      withCredentials: true
    });
    const forumData = response.data.data

    return {
      forums: forumData,
      empty: !response.data.data || response.data.data.length === 0
    };

  } catch (error) {
    console.log(error.message);
  }
}
