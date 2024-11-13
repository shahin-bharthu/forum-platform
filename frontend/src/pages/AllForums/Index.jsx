import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { useLoaderData, useNavigate } from "react-router-dom";
import MediaCard from '../MyForums/Components/Card';
import { useState } from 'react';
import PositionedSnackbar from '../../components/SnackBar.jsx';

export default function AllForums() {

  const { subscribedForums, subscribableForums, subscribableEmpty,subscribedEmpty } = useLoaderData();
  const navigate = useNavigate();
  const [subscribableForumsState, setSubscribableForumsState] = useState(subscribableForums);
  const [message, setMessage] = useState();
  const [counter, setCounter] = useState(0);
  

  const handleSubscribe = async (event, forumId) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/forum/subscribe/${forumId}`,
        null,
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );

      setMessage(`Subscribed to ${forumId}`);
      setSubscribableForumsState((prevState) =>
        prevState.filter((id) => id !== forumId)
      );

      setTimeout(() => {
        setMessage(null);
        // window.location.reload();
        setCounter((val) => val + 1);
        navigate('/user/forums')
      }, 1000);


    } catch (error) {
      console.error("Error: ", error);
      return {
        allForums: [],
        subscribableForums: [],
        empty: true,
      };
    }
  };

  const handleViewDetails = (event, forum_id) => {
    event.preventDefault();
    navigate(`/forum/${forum_id}`);
  };

  if (subscribableEmpty && subscribedEmpty) {
    return (
      <p>No forums</p>
    );
  }
 
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 2 }}
        columns={{ xs: 3, sm: 8, md: 12 }}
        sx={{ mx: 3, py: 11, justifyContent: "center", alignContent: "center" }}
      >
        {message && (
          <PositionedSnackbar message={message} />
        )}
        {!subscribedEmpty && <Grid size={12} >
          <h2>Subscribed Forums</h2>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 3, sm: 8, md: 12 }} sx={{ mx: 1, py: 1, justifyContent: 'center', alignContent: 'center' }}>
          {subscribedForums.map((forum) => {
            return (
              <Grid key={forum.id} size={{ xs: 2, sm: 3, md: 3 }}>
                <MediaCard
                  name={forum.name}
                  purpose={forum.purpose}
                  logo={forum.logo}
                  createdBy={forum.createdBy}
                  forumId={forum.forum_id}
                  canSubscribe={false}
                  onSubscribe={null}
                  onViewDetails={(event) => handleViewDetails(event, forum.forum_id)}
                  myForum={false}
                  onEditForum={null}
                />
              </Grid>
            );
          })}
          </Grid>
        </Grid>}
        {!subscribableEmpty && <Grid size={12}> 
          <h2>More Forums</h2>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 3, sm: 8, md: 12 }} sx={{ mx: 1, py: 1, justifyContent: 'center', alignContent: 'center' }}>
          {subscribableForums.map((forum) => {
            return (
              <Grid key={forum.id} size={{ xs: 2, sm: 3, md: 3 }}>
                <MediaCard
                  name={forum.name}
                  purpose={forum.purpose}
                  logo={forum.logo}
                  createdBy={forum.createdBy}
                  forumId={forum.forum_id}
                  canSubscribe={true}
                  onSubscribe={(event) => handleSubscribe(event, forum.forum_id)}
                  onViewDetails={(event) => handleViewDetails(event, forum.forum_id)}
                />
              </Grid>
            );
          })}
          </Grid>
        </Grid>}
      </Grid>
    </Box>
  );
}

export async function allForumLoader() {
  try {
    const subscribedForums = await axios.get('http://localhost:8080/forum/subscribed-forums', {
      withCredentials: true
    });
    const subscribedForumsData = subscribedForums.data.data

    const subscribableForums = await axios.get("http://localhost:8080/forum/can-subscribe-to", {
      withCredentials: true,
    });
    const subscribableForumsData = subscribableForums.data.data
    
    return {
      subscribedForums: subscribedForumsData,
      subscribableForums: subscribableForumsData,
      subscribableEmpty: subscribableForumsData.length === 0,
      subscribedEmpty:subscribedForumsData.length === 0
    };

  } catch (error) {
    console.log("error in loader");
    console.log(error.message);
    return {
      subscribedForums: [],
      subscribableForums: [],
      subscribableEmpty: true,
      subscribedEmpty:true
    };
  }
}