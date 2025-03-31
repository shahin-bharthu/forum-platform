import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Divider,
  Avatar,
  Stack,
  Tooltip,
  Chip,
  useMediaQuery,
  useTheme,
  tooltipClasses,
  Snackbar,
  SnackbarContent,
  Box,
} from "@mui/material";
import {
  CakeOutlined as CakeOutlinedIcon,
  FaceOutlined as FaceOutlinedIcon,
  GroupsOutlined as GroupsOutlinedIcon,
  Email as EmailIcon,
  NumbersRounded as NumbersRoundedIcon,
  Public as PublicIcon,
  VpnLock as VpnLockIcon,
  Check as CheckIcon,
  Share,
  QuestionAnswerRounded,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { stringToColor } from "../../../../utils/avatarColor";

export default function UserInfo({
  user,
  userDoj,
  forumsCreated,
  postLength,
  commentlength,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentUrl, setCurrentUrl] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href || "");
    }
  }, []);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch(() => {
        console.log("Failed to copy");
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("-");
  };

  return (
    <>
      <Card
        sx={{
          mb: 2,
          width: "100%",
          maxWidth: 600,
          margin: "auto",
        }}
      >
        <CardContent>
          <Tooltip
            title={user}
            placement="top-start"
            slotProps={{
              popper: {
                sx: {
                  [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                    {
                      marginBottom: "0px",
                    },
                },
              },
            }}
            arrow
          >
            <Typography
              variant="h6"
              fontWeight="medium"
              component="div"
              sx={{
                textAlign: "left",
                mb: 1,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                width: "90%",
              }}
            >
              {user}
            </Typography>
          </Tooltip>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              size="small"
              sx={{
                mb: 1,
                borderRadius: 5,
                bgcolor: "#6a1b9a",
                justifyItems: "flex-start",
              }}
              startIcon={<Share />}
              onClick={handleCopyLink}
            >
              Share
            </Button>
          </Box>

          <Stack spacing={1} direction="row" alignItems="center" sx={{ my: 2 }}>
            <CakeOutlinedIcon
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            />
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              user since {formatDate(userDoj)}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "space-evenly",
              alignItems: "center",
              flexWrap: "wrap",
              gap: postLength ? 1 : 3,
            }}
          >
            <Tooltip title="Number of posts">
              <Chip
                icon={<NumbersRoundedIcon />}
                label={postLength}
                sx={{
                  "& .MuiChip-icon": {
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  },
                  "& .MuiChip-label": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  },
                }}
              />
            </Tooltip>
            <Tooltip title="Number of comments">
              <Chip
                icon={<QuestionAnswerRounded />}
                label={commentlength}
                sx={{
                  "& .MuiChip-icon": {
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  },
                  "& .MuiChip-label": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  },
                }}
              />
            </Tooltip>
          </Stack>
        </CardContent>

        <Divider />

        <CardActions sx={{ pb: 2 }}>
          <Stack
            sx={{
              mx: 1,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              fontWeight="medium"
              sx={{
                textAlign: "left",
                width: "100%",
                mb: 1,
              }}
            >
              Forums Created
            </Typography>

            {forumsCreated.length > 0 &&
              forumsCreated.map((forum) => {
                return (
                  <>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        width: "100%",
                        m: 0.5,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(105, 27, 154, 0.23)", // Optional: add a white background on hover
                        },
                        p: 1,
                        borderRadius: 3,
                      }}
                      onClick={() => {
                        navigate(`/forum/${forum.forum_id}`);
                      }}
                    >
                      <Avatar
                        alt={forum.name}
                        src="/static/images/avatar/1.jpg"
                        sx={{
                          width: 33,
                          height: 33,
                          bgcolor: stringToColor(forum.name),
                        }}
                      />
                      <div style={{ display:"flex", justifyContent: "space-between", width:"100%"}} >
                      <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"start"}} >
                      <Typography variant="subtitle2" sx={{m:0,p:0}} >{forum.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{m:0,p:0}} >
                        {forum.subscriber_count} {forum.subscriber_count > 1 ? "members" : "member"}
                        </Typography>
                      </div>
                      <Button size="small" sx={{}} >Subscribe</Button>
                      </div>
                    </Stack>
                  </>
                );
              })}
          </Stack>
        </CardActions>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <SnackbarContent
          sx={{ bgcolor: "#6a1b9a", color: "white" }}
          message="Link copied to clipboard!"
        />
      </Snackbar>
    </>
  );
}
