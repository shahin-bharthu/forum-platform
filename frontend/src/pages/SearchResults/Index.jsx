import { Children, memo, useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Tooltip } from "@mui/material";
import axiosInstance from "../../../utils/axiosInstance.js";
import highlightText from "../../../utils/highlightText.jsx";
import { renderHTML } from "../PostDetails/Components/CodeBlockViewer.jsx";
import NoResultFound from "../../components/NoResultFound.jsx";

const SearchResults = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { forumResults, postResults } = location.state || {forumResults: [], postResults: []};
  const [searchForumsResults, setSearchForumsResults] = useState([{id: '', forum_id: '', name: 'No results found', purpose: 'Try searching for something else', avatarUrl: '', }]);
  const [searchPostsResults, setSearchPostsResults] = useState([{title: 'No results found', content: 'Try searching for something else', username: '', userAvatar: '', forumName: ''}])
  const [searchCommentsResults, setSearchCommentsResults] = useState([{comment: {content: 'Double-check your spelling or try different keywords'}, topic: {id: ''}, forum: {}, user: {username: 'No results found'}, avatar: ''}]);
  const [value, setValue] = useState(0);

  const searchComments = async (searchText) => {
      const response = await axiosInstance.get(`comment/search/${searchText}`);
      
      const results = response.data.data || [];
      if (results.length > 0) {
        const commentsData = await Promise.all(results.map(async (comment) => {
          const commentResponse = (await axiosInstance.get(`comment/id/${comment.id}`)).data;
          const userAvatar = (await axiosInstance.get(`/user/avatar/${commentResponse.data.user.id}`, {responseType: 'blob'})).data;
          return {
            ...commentResponse.data,
            avatar: URL.createObjectURL(userAvatar)
          }
        }));
        setSearchCommentsResults(commentsData);
      }
      else {
        setSearchCommentsResults([]);
      }
  }

  const getForumAvatars = async (forumsList) => {
    const forumData = await Promise.all(forumsList.map(async (forum) => {
      if (forum.id) {
        const forumAvatarPath = await axiosInstance.get(`/forum/banner/${forum.id}`, { responseType: 'blob' });
        if (forumAvatarPath.data) {
          return {
            ...forum,
            forum_id: forum.name.replace(/\s+/g, '_').toLowerCase(),
            avatarUrl: URL.createObjectURL(forumAvatarPath.data)
          } 
        }
      }
    }));    
    setSearchForumsResults(forumData)
  }

  const getPostDetails = async (topicsList) => {
    const topicsData = await Promise.all(topicsList.map(async (topic) => {
      if (topic.id) {
        const topicRes = (await axiosInstance.get(`/topic/${topic.id}`)).data;
        const topicCreatorAvatar = (await axiosInstance.get(`/user/avatar/${topicRes.data.user.id}`, {responseType: 'blob'})).data;
        return {
          ...topic,
          username: topicRes.data.username,
          userAvatar: URL.createObjectURL(topicCreatorAvatar),
          forumName: topicRes.data.forum.name
        }
      }
    }))
    setSearchPostsResults(topicsData);
  }

  useEffect(() => {
    searchComments(params.searchText);
      getForumAvatars(forumResults);
      getPostDetails(postResults);
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
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab label="Forums" {...a11yProps(0)} />
          <Tab label="Posts" {...a11yProps(1)} />
          <Tab label="Comments" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <List sx={{ width: '100%' }}>
          {searchForumsResults.length > 0 ? searchForumsResults.map((forum) => {
            return (
              <>
                <ListItem alignItems="flex-start" sx={{bgcolor: 'background.paper', borderRadius: 5}}>
                  <ListItemAvatar>
                    <Avatar alt={forum.name} src={forum.avatarUrl} />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{cursor: 'pointer', wordBreak: 'break-word'}}
                    onClick={() => navigate(`/forum/${forum.forum_id}`)}
                    primary={highlightText(forum.name, params.searchText)}
                    secondary={highlightText(forum.purpose, params.searchText)}
                  />
                </ListItem>
                <Divider variant="middle" component="li" sx={{my: 0.5}} />
              </>
            )
          })
          :
          <NoResultFound searchText={params.searchText} />
          }
        </List>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <List sx={{ width: '100%'}}>
        {searchPostsResults.length >0 ? searchPostsResults.map((post) => {
          return (
            <>
              <ListItem alignItems="flex-start" sx={{bgcolor: 'background.paper', borderRadius: 5}}>
                <Tooltip title={post.username}>
                  <ListItemAvatar>
                    <Avatar alt={post.username} src={post.userAvatar} />
                  </ListItemAvatar>
                </Tooltip>
                <ListItemText
                  sx={{cursor: 'pointer', wordBreak: 'break-word'}}
                  onClick={() => navigate(`/post/${post.id}`)}
                  primary={highlightText(post.title, params.searchText)}
                  // secondary={highlightText(Children.toArray(renderHTML(post.content)).map(child => 
                  //         typeof child.props?.children === 'string' 
                  //           ? child.props.children 
                  //           : ''
                  //       )
                  //       .filter(Boolean)
                  //       .join(' '), 
                  //   params.searchText
                  // )}
                  secondary={renderHTML(post.content)}
                  />
              </ListItem>
              <Divider variant="middle" component="li" sx={{my: 0.5}}/>
            </>
          )
        }) 
        :
        <NoResultFound searchText={params.searchText} />
        
        // <ListItem sx={{bgcolor: 'background.paper', borderRadius: 5}}>
        //   <ListItemAvatar>
        //             <Avatar alt="no results found" src="/no-results-found.png" sx={{ width: 150, height: 150 }} />
        //     </ListItemAvatar>
        //   <ListItemText
        //     primary={`No results found for "${params.searchText}"`}
        //     secondary="Double-check your spelling or try different keywords"
        //   />
        // </ListItem>
        }
      </List>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <List sx={{ width: '100%'}}>
          { searchCommentsResults.length > 0 ? searchCommentsResults.map((result) => {
            return (
              <>
              <ListItem alignItems="flex-start" sx={{bgcolor: 'background.paper', borderRadius: 5}}>
                <Tooltip title={result.user.username}>
                  <ListItemAvatar>
                    <Avatar alt="No results found" src={result.avatar} />
                  </ListItemAvatar>
                </Tooltip>
                <ListItemText
                  sx={{cursor: 'pointer', wordBreak: 'break-word'}}
                  onClick={() => navigate(`/post/${result.topic.id}`)}
                  primary={highlightText(result.user.username, params.searchText)}
                  secondary={highlightText(result.comment.content, params.searchText)}
                />
              </ListItem>
              <Divider variant="middle" component="li" sx={{my: 0.5}}/>
              </>
            )
          })
        :
          <NoResultFound searchText={params.searchText} />
        }
        </List>
      </CustomTabPanel>
      
    </Box>
  );
};

export default SearchResults;