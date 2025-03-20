import PropTypes from "prop-types";
import {Box, Tabs, Tab} from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { styled } from "@mui/system";

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid rgba(255, 255, 255, 0)",
  "& .MuiTabs-indicator": {
    backgroundColor: "transparent",
  },
  "& .MuiTabScrollButton-root": {
    color: "#ab47bc",
  },
});

function LinkTab(props) {
  return (
    <Tab
      sx={{
        borderRadius: 7,
        border: "none",
        color: "#ab47bc",
        "&.Mui-selected": { color: "#7b1fa2", bgcolor: "#e1bee7" },
        m: 1,
        "&:hover": {
          color: "#6a1b9a",
        },
      }}
      component={Link}
      {...props}
    />
  );
}

LinkTab.propTypes = {
  selected: PropTypes.bool,
};

export default function ActivityTabs({ isCurrentUser } ) {
  const location = useLocation();
  
  //All tabs
  const allTabs = useMemo(() => [
    { label: "Overview", path: "", index: 0, optional: false },
    { label: "Posts", path: "posts", index: 1, optional: false },
    { label: "Comments", path: "comments", index: 2, optional: false },
    { label: "Liked", path: "liked", index: 3, optional: !isCurrentUser },
    { label: "Saved", path: "saved", index: 4, optional: !isCurrentUser }
  ], []);
  
  // Filter tabs 
  const visibleTabs = useMemo(() => 
    allTabs.filter(tab => !tab.optional),
  [allTabs]);
  
  // Set initial tab value based on current path
  const initialValue = useMemo(() => {
    const path = location.pathname;
    const matchedTab = allTabs.find(tab => 
      path.endsWith(`/${tab.path}`) || (tab.path === "" && path.endsWith("/"))
    );
    return matchedTab ? matchedTab.index : 0;
  }, [location.pathname, allTabs]);
  
  const [value, setValue] = useState(initialValue);
  
  // Update tab value when location changes
  useEffect(() => {
    const path = location.pathname;
    const matchedTab = allTabs.find(tab => 
      path.endsWith(`/${tab.path}`) || (tab.path === "" && path.endsWith("/"))
    );
    
    if (matchedTab && (!matchedTab.optional)) {
      setValue(matchedTab.index);
    } else {
      setValue(0); // Default to Overview
    }
  }, [location, allTabs]);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <AntTabs
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {visibleTabs.map(tab => (
            <LinkTab 
              key={tab.path} 
              label={tab.label} 
              to={tab.path} 
            />
          ))}
        </AntTabs>
      </Box>
      <Outlet />
    </>
  );
}