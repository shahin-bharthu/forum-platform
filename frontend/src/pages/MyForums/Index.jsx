import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import MediaCard from './Components/Card';
import axios from 'axios';
import { useLoaderData, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { useState } from 'react';
import PositionedSnackbar from '../../components/SnackBar';

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
  const { privateForums, publicForums, archivedForums, empty } = useLoaderData();
  const [message, setMessage] = useState();
  const navigate=useNavigate()
  
  const handleCreate=()=>{
    navigate('/user/add-forum')
  }
  
  if (empty) {
    console.log('in empty');
    
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
  
  const handleEditForum = (event, forum_id) => {
      event.preventDefault();
      navigate(`/user/edit-forum/${forum_id}`)
  }

  const handleViewDetails = (event, forum_id) => {
    event.preventDefault();
    navigate(`/forum/${forum_id}`);
  }

  const handleArchiveForum = async (event, id, archiving) => {
    event.preventDefault();
    const response = await axios.patch(`http://localhost:8080/forum/archive/${id}`, null, {
      withCredentials: true
    })
    
    if (archiving) {
      setMessage(`Archived forum ${response.data.data.name}`);
    }
    else {
      setMessage(`Unarchived forum ${response.data.data.name}`);
    }
    setTimeout(() => {
      setMessage(null);
      navigate('/user/my-forums')
    }, 1000);
  }


  return (
    <>
      <Box sx={{ flexGrow: 1 , mt:10}}>
        {message && (
          <PositionedSnackbar message={message} />
        )}
        {publicForums.length > 0 && (
          <Grid size={12}>
            <h2>Public Forums</h2><br/>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 3, sm: 8, md: 12 }}
              sx={{
                mx: 1,
                py: 1,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              {publicForums.map((forum) => (
                <Grid key={forum.id} size={{ xs: 2, sm: 3, md: 3 }}>
                  <MediaCard
                    name={forum.name}
                    purpose={forum.purpose}
                    logo={forum.logo}
                    createdBy={forum.createdBy}
                    forumId={forum.forum_id}
                    canSubscribe={false}
                    onViewDetails={(event) =>
                      handleViewDetails(event, forum.forum_id)
                    }
                    myForum={true}
                    onEditForum={(event) =>
                      handleEditForum(event, forum.forum_id)
                    }
                    isArchived={false}
                    onArchive={(event) => 
                      handleArchiveForum(event, forum.id, true)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          
        )}

        {privateForums.length >0 && (
          <Grid size={12}>
            <h2>Private Forums</h2> <br />
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 3, sm: 8, md: 12 }}
            sx={{
              mx: 1,
              py: 1,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {privateForums.map((forum) => (
              <Grid key={forum.id} size={{ xs: 2, sm: 3, md: 3 }}>
                <MediaCard
                  name={forum.name}
                  purpose={forum.purpose}
                  logo={forum.logo}
                  createdBy={forum.createdBy}
                  forumId={forum.forum_id}
                  canSubscribe={false}
                  onViewDetails={(event) =>
                    handleViewDetails(event, forum.forum_id)
                  }
                  myForum={true}
                  onEditForum={(event) =>
                    handleEditForum(event, forum.forum_id)
                  }
                  isArchived={false}
                  onArchive={(event) => 
                    handleArchiveForum(event, forum.id, true)
                  }
                />
              </Grid>
            ))}
          </Grid>
          </Grid>
        )}

        {archivedForums.length >0  && (
          <Grid size={12}>
          <h2>Archived Forums</h2> <br />
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 3, sm: 8, md: 12 }}
            sx={{
              mx: 1,
              py: 1,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {archivedForums.map((forum) => (
              <Grid key={forum.id} size={{ xs: 2, sm: 3, md: 3 }}>
                <MediaCard
                  name={forum.name}
                  purpose={forum.purpose}
                  logo={forum.logo}
                  createdBy={forum.createdBy}
                  forumId={forum.forum_id}
                  canSubscribe={false}
                  onViewDetails={(event) =>
                    handleViewDetails(event, forum.forum_id)
                  }
                  myForum={true}
                  onEditForum={(event) =>
                    handleEditForum(event, forum.forum_id)
                  }
                  isArchived={true}
                  onArchive={(event) => 
                    handleArchiveForum(event, forum.id, false)
                  }
                />
              </Grid>
            ))}
          </Grid>
          </Grid>
        )}
      </Box>
      <FloatingActionButtons onClick={handleCreate} />
    </>
  );
}

export async function forumLoader() {
  try {
    const response = await axios.get('http://localhost:8080/forum/my-forums', {
      withCredentials: true
    });
    const publicForums = response.data.publicUserForums;
    const privateForums = response.data.privateUserForums;
    const archivedForums = response.data.archivedUserForums;
    
    return {
      publicForums,
      privateForums,
      archivedForums,
      empty: !publicForums && publicForums.length === 0 && !privateForums && privateForums.length === 0 && !archivedForums && archivedForums.length === 0
    };

  } catch (error) {
    console.log(error.message);
  }
}