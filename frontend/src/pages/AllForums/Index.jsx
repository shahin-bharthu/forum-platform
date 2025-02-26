import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import MediaCard from "../MyForums/Components/Card";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axiosInstance from "../../../utils/axiosInstance.js";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification, setNotification } from "../../store/uiSlice.js";
import {
  setSubscribableForums,
  setSubscribedForums,
} from "../../store/allForumsSlice.js";
import axios from "axios";
import { AnimatePresence } from "motion/react";
import AnimatedGrid from "../../components/GridMotion.jsx";
import * as motion from "motion/react-client";
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

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AllForums() {
  const navigate = useNavigate();
  const subscribableForums = useSelector(
    (state) => state.allForums.subscribableForums
  );
  const subscribedForums = useSelector(
    (state) => state.allForums.subscribedForums
  );
  const [subscribedEmpty, setSubscribedEmpty] = useState(false);
  const [subscribableEmpty, setSubscribableEmpty] = useState(false);
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    async function allForumLoader() {
      try {
        const subscribedForums = await axiosInstance.get(
          "/forum/subscribed-forums"
        );
        const subscribedForumsData = subscribedForums.data.data;
        dispatch(setSubscribedForums(subscribedForumsData));

        const subscribableForums = await axiosInstance.get(
          "/forum/can-subscribe-to"
        );
        const subscribableForumsData = subscribableForums.data.data;
        dispatch(setSubscribableForums(subscribableForumsData));

        setSubscribableEmpty(subscribableForumsData.length === 0);
        setSubscribedEmpty(subscribedForumsData.length === 0);
      } catch (error) {
        console.log("error in loader fetching all forums: ", error.message);
      }
    }

    allForumLoader();
  }, [dispatch]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubscribe = async (event, forumId) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/forum/subscribe/${forumId}`,
        null,
        { withCredentials: true }
      );

      dispatch(
        setNotification({
          message: `Subscribed to ${response.data.data.name}`,
          type: null,
        })
      );
      const updatedSubscribableForums = subscribableForums.filter(
        (forum) => forum.id !== response.data.data.id
      );
      const updatedSubscribedForums = [...subscribedForums, response.data.data];

      setTimeout(() => {
        dispatch(setSubscribableForums(updatedSubscribableForums));
        dispatch(setSubscribedForums(updatedSubscribedForums));
        dispatch(clearNotification());
        navigate("/user/forums");
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
    return <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >No forums</motion.p>;
  }

  return (
    <Box sx={{ flexGrow: 1, mt: 10, width: "100%", mx: 2, alignSelf: "start" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", position: "sticky" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Subscribed Forums" {...a11yProps(0)} />
          <Tab label="More Forums" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <AnimatePresence mode="wait">
        <CustomTabPanel value={value} index={0}>
          
          {subscribedEmpty && <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Subscribe to forums to see here.
            </motion.p>}
          {!subscribedEmpty && (
            <Grid size={12}>
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
                  {subscribedForums.map((forum,index) => {
                    return (
                      <Grid size={{ xs: 2, sm: 3, md: 3 }}>
                        <AnimatedGrid delay={index} key={forum.id}>
                          <MediaCard
                            id={forum.id}
                            name={forum.name}
                            purpose={forum.purpose}
                            logo={forum.logo}
                            createdBy={forum.createdBy}
                            forumId={forum.forum_id}
                            canSubscribe={false}
                            onSubscribe={null}
                            onViewDetails={(event) =>
                              handleViewDetails(event, forum.forum_id)
                            }
                            myForum={false}
                          onEditForum={null}
                        />
                      </AnimatedGrid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {subscribableEmpty &&  <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >Nothing to show here!
            </motion.p>}
          {!subscribableEmpty && (
            <Grid size={12}>
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
                {subscribableForums.map((forum,index) => {
                  return (
                    <Grid size={{ xs: 2, sm: 3, md: 3 }}>
                      <AnimatedGrid delay={index} key={forum.id}>
                        <MediaCard
                          id={forum.id}
                          name={forum.name}
                          purpose={forum.purpose}
                          logo={forum.logo}
                          createdBy={forum.createdBy}
                          forumId={forum.forum_id}
                          canSubscribe={true}
                          onSubscribe={(event) =>
                            handleSubscribe(event, forum.forum_id)
                          }
                          onViewDetails={(event) =>
                            handleViewDetails(event, forum.forum_id)
                          }
                        />
                      </AnimatedGrid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          )}
        </CustomTabPanel>
      </AnimatePresence>
    </Box>
  );
}
