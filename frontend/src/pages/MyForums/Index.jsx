import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import MediaCard from './Components/Card';

export default function MyForum() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{mx:3, py:11, justifyContent:'center', alignContent:'center'}}>
        {Array.from(Array(9)).map((_, index) => (
          <Grid key={index} size={{ xs: 2, sm: 3, md: 3 }}>
            <MediaCard/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
