import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import axiosInstance from "../../../utils/axiosInstance";

const SearchResults = () => {
  const params = useParams();
  const location = useLocation();
  const { forumResults, postResults } = location.state || {forumResults: [], postResults: []};
  const [searchCommentsResults, setSearchCommentsResults] = useState([{comment: {content: 'No results found'}, topic: {}, forum: {}}]);

  const searchComments = async (searchText) => {
      const response = await axiosInstance.get(`comment/search/${searchText}`);
      const results = response.data.data || [];
      const commentsData = await Promise.all(results.map(async (comment) => {
        const commentResponse = (await axiosInstance.get(`comment/id/${comment.id}`)).data;
        return commentResponse.data;
      }));
      setSearchCommentsResults(commentsData);
  }

  const getForumAvatars = async (forumsList) => {
    const forumAvatars = await Promise.all(forumsList.map(async (forum) => {
      const forumData = await axiosInstance.get(`/forum/banner/${forum.id}`)
    }))
    console.log(forumResults);
  }

  useEffect(() => {
    searchComments(params.searchText);
    getForumAvatars(forumResults);
  }, [])

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

      {/* <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          gridTemplateRows: "repeat(3, 1fr)",
          gridTemplateAreas: `"header header" "forums posts" "comments comments"`,
          width: "100vw",
          height: "90vh",
          margin: "10px",
          gap: "5px",
          marginTop: "50px"
        }}
      >

        <h1 style={{ gridArea: "header", border: "1px solid pink" }}>
          Search Results for {params.searchText}
        </h1>

        <ul style={{ gridArea: "forums", border: "1px solid pink" }}>
          {forumResults.map((forum) => {
            return <li style={{ textAlign: "left" }}>{forum.name}</li>;
          })}
        </ul>

        <ul style={{ gridArea: "posts", border: "1px solid pink" }}>
          {postResults.map((post) => {
            return <li style={{ textAlign: "left" }}>{post.title}</li>;
          })}
        </ul>

        <ul style={{ gridArea: "comments", border: "1px solid pink" }}>
          {searchCommentsResults.map((result) => {
            return <li style={{ textAlign: "left" }}>{result.comment.content}</li>;
          })}
        </ul>

      </div> */}

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', mt: 10, alignSelf: 'start' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Forums" {...a11yProps(0)} />
          <Tab label="Posts" {...a11yProps(1)} />
          <Tab label="Comments" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <List sx={{ width: '100%' }}>
          {forumResults.map((forum) => {
            return (
              <>
                <ListItem alignItems="flex-start" sx={{bgcolor: 'background.paper', borderRadius: 5}}>
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={forum.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: 'text.primary', display: 'inline' }}
                          >
                        </Typography>
                        {forum.purpose}
                      </>
                    }
                    />
                </ListItem>
                <Divider variant="middle" component="li" sx={{my: 0.5}} />
              </>
            )
          })}
        </List>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <List sx={{ width: '100%'}}>
        {postResults.map((post) => {
          return (
            <>
              <ListItem alignItems="flex-start" sx={{bgcolor: 'background.paper', borderRadius: 5}}>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={post.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: 'text.primary', display: 'inline' }}
                        >
                      </Typography>
                      {post.content}
                    </>
                  }
                  />
              </ListItem>
              <Divider variant="middle" component="li" sx={{my: 0.5}}/>
            </>
          )
        })}
      </List>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <List sx={{ width: '100%'}}>
          {searchCommentsResults.map((comment) => {
            return (
              <>
                <ListItem alignItems="flex-start" sx={{bgcolor: 'background.paper', borderRadius: 5}}>
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.comment.content}/>
                </ListItem>
                <Divider variant="middle" component="li" sx={{my: 0.5}}/>
              </>
            )
          })}
        </List>
      </CustomTabPanel>

    </Box>
  );
};

export default SearchResults;
