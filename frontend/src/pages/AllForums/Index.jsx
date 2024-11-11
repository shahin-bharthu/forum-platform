import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { useLoaderData, useNavigate } from "react-router-dom";
import MediaCard from '../MyForums/Components/Card';
import { useState } from 'react';
import PositionedSnackbar from '../../components/SnackBar.jsx';

export default function AllForums() {

  const {subscribedForums, subscribableForums, empty} = useLoaderData();
  const navigate = useNavigate();
  const [subscribableForumsState, setSubscribableForumsState] = useState(subscribableForums);
  const [message, setMessage] = useState();

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
      }, 2000);

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

  if (empty) {
    return (
     <p>No forums</p>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 3, sm: 8, md: 12 }}
        sx={{ mx: 3, py: 11, justifyContent: "center", alignContent: "center" }}
        >
        {message && (
          <PositionedSnackbar message={message}/>
        )}
        <h5>Subscribed Forums</h5>
        {subscribedForums.map((forum) => {
          // const canSubscribe = subscribableForumsState.includes(forum.forum_id);
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
                />
              </Grid>
            );
        })}


        <h5>More Forums</h5>
        {subscribableForums.map((forum) => {
          // const canSubscribe = subscribableForumsState.includes(forum.forum_id);
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
    </Box>
  );
}

export async function allForumLoader() {
  try {
    const subscribedForums = await axios.get('http://localhost:8080/forum/subscribed-forums', {
      withCredentials: true
    });
    const subscribedForumsData = subscribedForums.data.data
    console.log(subscribedForumsData);
    
    const subscribableForums = await axios.get("http://localhost:8080/forum/can-subscribe-to", {
      withCredentials: true,
    });
    const subscribableForumsData = subscribableForums.data.data
    // const subscribableForumIds = subscribableForumsData.map(forum => forum.forum_id)
    
    return {
      subscribedForums: subscribedForumsData,
      subscribableForums: subscribableForumsData,
      empty: !subscribableForums.data.data || subscribableForums.data.data.length === 0,
    };

  } catch (error) {    
    console.log("error in loader");
    console.log(error.message);
    return {
      subscribedForums: [],
      subscribableForums: [],
      empty: true,
    };
  }
}