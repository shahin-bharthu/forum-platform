import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { forumResults, postResults } = location.state || {forumResults: [], postResults: []};
  const [searchCommentsResults, setSearchCommentsResults] = useState([{comment: {content: 'No results found'}, topic: {id: ''}, forum: {}, user: {username: ''}}]);
  const [searchForumsResults, setSearchForumsResults] = useState([{id: '', forum_id: '', name: '', purpose: '', avatarUrl: '', }]);
  const [value, setValue] = useState(0);

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
    const forumData = await Promise.all(forumsList.map(async (forum) => {
      const forumAvatarPath = await axiosInstance.get(`/forum/banner/${forum.id}`, { responseType: 'blob' });
      if (forumAvatarPath.data) {
        return {
          ...forum,
          forum_id: forum.name.replace(/\s+/g, '_').toLowerCase(),
          avatarUrl: URL.createObjectURL(forumAvatarPath.data)
        } 
      }
    }));
    setSearchForumsResults(forumData)
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
          {searchForumsResults.map((forum) => {
            return (
              <>
                <ListItem alignItems="flex-start" sx={{bgcolor: 'background.paper', borderRadius: 5}}>
                  <ListItemAvatar>
                    <Avatar alt={forum.name} src={forum.avatarUrl} />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{cursor: 'pointer'}}
                    onClick={() => navigate(`/forum/${forum.forum_id}`)}
                    primary={forum.name}
                    secondary={forum.purpose}
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
                  sx={{cursor: 'pointer'}}
                  onClick={() => navigate(`/post/${post.id}`)}
                  primary={post.title}
                  secondary={post.content}
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
          {searchCommentsResults.map((result) => {
            return (
              <>
              <ListItem alignItems="flex-start" sx={{bgcolor: 'background.paper', borderRadius: 5}}>
                <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  sx={{cursor: 'pointer'}}
                  onClick={() => navigate(`/post/${result.topic.id}`)}
                  primary={result.user.username}
                  secondary={result.comment.content}
                />
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
