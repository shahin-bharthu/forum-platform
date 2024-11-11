import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { useLoaderData, useNavigate } from "react-router-dom";
import MediaCard from '../MyForums/Components/Card';
import { useState } from 'react';
import PositionedSnackbar from '../../components/SnackBar.jsx';

export default function AllForums() {

  const {allForums, subscribableForums, empty} = useLoaderData();
  const navigate = useNavigate();
  const [subscribableForumsState, setSubscribableForumsState] = useState(subscribableForums);
  const [message, setMessage] = useState();

  const handleSubscribe = async (event, forumId) => {
    event.preventDefault();
    // console.log("in handle subscribe for", forumId);

    try {
      const response = await axios.post(
        `http://localhost:8080/forum/subscribe/${forumId}`,
        null,
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );
      console.log(response.data);

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
        {allForums.map((forum) => {
          // Check if the forum can be subscribed to
          const canSubscribe = subscribableForumsState.includes(forum.forum_id);

          return (
            <Grid key={forum.id} size={{ xs: 2, sm: 3, md: 3 }}>
              <MediaCard
                name={forum.name}
                purpose={forum.purpose}
                logo={forum.logo}
                createdBy={forum.createdBy}
                forumId={forum.forum_id}
                canSubscribe={canSubscribe} // Set canSubscribe based on the condition
                onSubscribe={
                  canSubscribe
                    ? (event) => handleSubscribe(event, forum.forum_id)
                    : null
                } // Pass handleSubscribe only if canSubscribe is true
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
    const allForums = await axios.get('http://localhost:8080/forum', {
      withCredentials: true
    });
    const forumData = allForums.data.data
    
    const subscribableForums = await axios.get("http://localhost:8080/forum/can-subscribe-to", {
      withCredentials: true,
    });
    const subscribableForumsData = subscribableForums.data.data
    const subscribableForumIds = subscribableForumsData.map(forum => forum.forum_id)
    
    return {
      allForums: forumData,
      subscribableForums: subscribableForumIds,
      empty: !allForums.data.data || allForums.data.data.length === 0,
    };

  } catch (error) {    
    console.log("error in loader");
    console.log(error.message);
  }
}