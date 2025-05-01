import { useEffect, useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Avatar,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
  Box,
  tooltipClasses,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../utils/axiosInstance.js";
import { useDispatch } from "react-redux";
import {
  clearNotification,
  setNotification,
} from "../../../store/slices/uiSlice.js";
import forumDetailsBackdrop from "../../../assets/ForumDetailsBackdrop.webp";
import Notification from "./Notification.jsx";

export default function ForumHeaderCard({ forum, setIsSubbed }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [subscribed, setSubscribed] = useState(false);
  const [bannerUrl, setBannerUrl] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    async function isSubscribed(forum) {
      const isUserSubscribed = await axiosInstance.get(
        `/forum/is-subscribed/${forum.id}`,
        {
          withCredentials: true,
        }
      );
      setSubscribed(isUserSubscribed.data.isSubscribed);
      setIsSubbed(isUserSubscribed.data.isSubscribed);
    }

    const fetchAvatar = async () => {
      await handleFileRead();
    };

    fetchAvatar().catch(console.error);
    isSubscribed(forum);
  }, []);

  const handleFileRead = async () => {
    const file = await axiosInstance.get(`/forum/banner/${forum.id}`, {
      responseType: "blob",
    });

    if (file.data) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result);
      };
      reader.readAsDataURL(file.data);
    }
  };

  const handleSubscribe = async (event, forumId) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post(
        `/forum/subscribe/${forumId}`,
        null
      );

      dispatch(
        setNotification({
          message: `Subscribed to ${response.data.data.name}`,
          type: null,
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
        setSubscribed(true);
        setIsSubbed(true);
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

  const handleUnSubscribe = async (event, forumId) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post(
        `/forum/unsubscribe/${forumId}`,
        null
      );

      dispatch(
        setNotification({
          message: `Unsubscribed from ${response.data.data.name}`,
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
        setSubscribed(false);
        setIsSubbed(false);
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

  return (
    <Card sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        height={isMobile ? "80" : "100"}
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100" // This helps the SVG scale properly
        preserveAspectRatio="none" // This ensures the SVG stretches to fill the container
      >
        <rect width="100%" height="100%" fill="url(#grad)" />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgba(144, 173, 198, 1)" }} />
            <stop offset="0%" style={{ stopColor: "rgba(233, 234, 236, 1)" }} />
            <stop offset="34%" style={{ stopColor: "rgba(240, 223, 154, 1)" }} />
            <stop offset="80%" style={{ stopColor: "rgba(250, 208, 44, 1)" }} />
          </linearGradient>
        </defs>
      </CardMedia>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "center" : "center",
          width: "100%",
          padding: theme.spacing(1),
          gap: theme.spacing(0.5),
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            padding: isMobile ? "8px !important" : undefined,
            p: isMobile ? 0 : 1.5,
            width: "60%",
          }}
        >
          <Stack
            spacing={2}
            direction="row"
            sx={{
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              textAlign: isMobile ? "center" : "left",
              width: "100%",
            }}
          >
            <Avatar
              alt="Forum Logo"
              src={bannerUrl}
              sx={{
                width: isMobile ? 45 : 60,
                height: isMobile ? 45 : 60,
                border: 2,
                borderColor: "primary.main",
              }}
            />
            <Tooltip
              title={forum.name}
              placement="bottom-start"
              slotProps={{
                popper: {
                  sx: {
                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                      {
                        marginTop: "0px",
                      },
                  },
                },
              }}
              arrow
            >
              <Typography
                variant={isMobile ? "h6" : "h5"}
                component="div"
                sx={{
                  margin: isMobile ? "0 !important" : undefined,
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                {forum.name}
              </Typography>
            </Tooltip>
          </Stack>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            gap: theme.spacing(1),
            padding: isMobile ? "8px !important" : undefined,
            pr: isMobile ? undefined : 4,
          }}
        >
          {subscribed && (
            <Tooltip title="Create Post" arrow>
              <Button
                disabled={forum.isActive ? false : true}
                onClick={() =>
                  navigate("/user/create-post", {
                    state: { forumName: forum.name, forumId: forum.id },
                  })
                }
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ borderRadius: 28, border: 2, borderColor: "secondary.dark", color: "secondary.dark", ":hover": { borderColor: "secondary.dark", backgroundColor: "secondary.dark", color: "primary.contrastText" } }}
                disableElevation
                size="small"
              >
                Create
              </Button>
            </Tooltip>
          )}

          <Tooltip title={subscribed ? "Unsubscribe" : "Subscribe"} arrow>
            <Button
              disabled={forum.isActive ? false : true}
              size="small"
              variant={subscribed ? "outlined" : "contained"}
              sx={{ borderRadius: 28, border: 2 }}
              disableElevation
              onClick={
                subscribed
                  ? (event) => handleUnSubscribe(event, forum.forum_id)
                  : (event) => handleSubscribe(event, forum.forum_id)
              }
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </Button>
          </Tooltip>
          {subscribed && <Notification forumId={forum.id} />}
        </CardActions>
      </Box>
    </Card>
  );
}
