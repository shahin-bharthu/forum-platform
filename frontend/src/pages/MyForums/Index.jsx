"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import MediaCard from "./Components/Card";
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PublicIcon from "@mui/icons-material/Public";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import ArchiveIcon from "@mui/icons-material/Archive";
import axiosInstance from "../../../utils/axiosInstance.js";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification, setNotification } from "../../store/slices/uiSlice.js";
import {
  setPublicForums,
  setPrivateForums,
  setArchivedForums,
} from "../../store/slices/userForumsSlice.js";
import axios from "axios";
import { AnimatePresence } from "motion/react";
import AnimatedGrid from "../../components/GridMotion.jsx";
import * as motion from "motion/react-client";
import AnimatedLayout from "../../components/AnimatedLayout.jsx";
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

// CustomTabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export function FloatingActionButtons({ onClick }) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        "& > :not(style)": { m: 0.5 },
      }}
    >
      <Fab color="primary" aria-label="add" onClick={onClick}>
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default function MyForum() {
  const [value, setValue] = useState(0);
  const publicForums = useSelector((state) => state.userForums.publicForums);
  const privateForums = useSelector((state) => state.userForums.privateForums);
  const archivedForums = useSelector(
    (state) => state.userForums.archivedForums
  );
  const [empty, setEmpty] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function forumLoader() {
      try {
        const response = await axiosInstance.get("/forum/my-forums");

        const publicForums = response.data.publicForums || [];
        const privateForums = response.data.privateForums || [];
        const archivedForums = response.data.archivedForums || [];
        const empty =
          publicForums.length === 0 &&
          privateForums.length === 0 &&
          archivedForums.length === 0;

        setEmpty(empty);
        dispatch(setPublicForums(publicForums));
        dispatch(setPrivateForums(privateForums));
        dispatch(setArchivedForums(archivedForums));
      } catch (error) {
        console.log(error.message);
      }
    }
    forumLoader();
  }, [location.key]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCreate = () => {
    navigate("/user/add-forum");
  };

  if (empty) {
    return (
      <>
        <AnimatedLayout>
          <h3>No forums found</h3>
          <p>Create your first forum to get started</p>
        </AnimatedLayout>
        <FloatingActionButtons onClick={handleCreate} />
      </>
    );
  }

  const handleEditForum = (event, forum_id) => {
    event.preventDefault();
    navigate(`/user/edit-forum/${forum_id}`);
  };

  const handleViewDetails = (event, forum_id) => {
    event.preventDefault();
    navigate(`/forum/${forum_id}`);
  };

  const handleArchiveForum = async (event, id, archiving) => {
    event.preventDefault();
    const response = await axios.patch(
      `http://localhost:8080/forum/archive/${id}`,
      null,
      { withCredentials: true }
    );

    if (archiving) {
      dispatch(
        setNotification({
          message: `Archived forum ${response.data.data.name}`,
          type: null,
        })
      );
    } else {
      dispatch(
        setNotification({
          message: `Unarchived forum ${response.data.data.name}`,
          type: null,
        })
      );
    }
    setTimeout(() => {
      dispatch(clearNotification());
      navigate("/user/my-forums");
    }, 1000);
  };

  return (
    <>
      <Box
        sx={{ flexGrow: 1, mt: 8, width: "100%", mx: 2, alignSelf: "start" }}
      >
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", position: "sticky" }}
        >
          <Tabs value={value} onChange={handleChange} centered>
            <Tab
              icon={<PublicIcon />}
              iconPosition="start"
              label="Public"
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              icon={<VpnLockIcon />}
              iconPosition="start"
              label="Private"
              {...a11yProps(1)}
              wrapped
            />
            <Tab
              icon={<ArchiveIcon />}
              iconPosition="start"
              label="Archived"
              {...a11yProps(2)}
              wrapped
            />
          </Tabs>
        </Box>
        <AnimatePresence mode="wait">
          <CustomTabPanel value={value} index={0}>
            {publicForums.length === 0 && <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >No Public Forums found</motion.p>}
            {publicForums.length > 0 && (
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
                  {publicForums.map((forum, index) => (
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
                      </AnimatedGrid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            {privateForums.length === 0 && <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >No Private Forums found</motion.p>}
            {privateForums.length > 0 && (
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
                  {privateForums.map((forum,index) => (
                    <Grid size={{ xs: 2, sm: 3, md: 3 }}>
                      <AnimatedGrid key={forum.id} delay={index}>
                        <MediaCard
                          id={forum.id}
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
                      </AnimatedGrid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {archivedForums.length === 0 && <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >No Archived Forums found</motion.p>}
            {archivedForums.length > 0 && (
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
                  {archivedForums.map((forum,index) => (
                    <Grid size={{ xs: 2, sm: 3, md: 3 }}>
                      <AnimatedGrid key={forum.id} delay={index}>
                        <MediaCard
                          id={forum.id}
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
                      </AnimatedGrid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </CustomTabPanel>
        </AnimatePresence>
      </Box>
      <FloatingActionButtons onClick={handleCreate} />
    </>
  );
}
