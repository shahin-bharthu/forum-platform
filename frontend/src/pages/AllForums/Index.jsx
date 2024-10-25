import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { useLoaderData, useNavigate } from "react-router-dom";
import MediaCard from '../MyForums/Components/Card';

export default function AllForums() {

  const {forums, empty} = useLoaderData();

  
  if (empty) {
    return (
     <p>No forums</p>
    );
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 3, sm: 8, md: 12 }} sx={{ mx: 3, py: 11, justifyContent: 'center', alignContent: 'center' }}>
        {forums.map((forum) => (
          <Grid key={forum.id} size={{ xs: 2, sm: 3, md: 3 }}>
            <MediaCard name={forum.name} purpose={forum.purpose} logo={forum.logo} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export async function allForumLoader() {
  try {
    const response = await axios.get('http://localhost:8080/forum', {
      withCredentials: true
    });
    const forumData = response.data.data
    
    return { 
      forums:forumData, 
      empty: !response.data.data || response.data.data.length === 0 
    };

  } catch (error) {    
    console.log(error.message);
  }
}
