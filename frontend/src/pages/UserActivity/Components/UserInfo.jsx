import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Divider,
  Link,
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
} from "@mui/icons-material";
import { useState, useEffect } from "react";
export default function UserInfo({ forum, creator, postLength, setIsPrivate }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentUrl, setCurrentUrl] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
            title={forum.name}
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
              {/* {forum.name} */}
              Ocar Piastri
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
              Created {formatDate(forum.createdAt)}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: postLength ? "space-between" : "flex-start",
              alignItems: "center",
              flexWrap: "wrap",
              gap: postLength ? 1 : 3,
            }}
          >
            <Chip
              icon={forum.isPublic ? <PublicIcon /> : <VpnLockIcon />}
              label={forum.isPublic ? "Public" : "Private"}
              color={forum.isPublic ? "primary" : "secondary"}
              sx={{
                "& .MuiChip-icon": {
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                },
                "& .MuiChip-label": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                },
              }}
            />

            {postLength >= 0 && (
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
            )}

            <Tooltip title="Number of subscribers">
              <Chip
                icon={<GroupsOutlinedIcon />}
                label={forum.subscriber_count}
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
              Admins
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ width: "100%", mb: 2 }}
            >
              <FaceOutlinedIcon />
              <Typography variant="body2" fontWeight="medium">
                {creator}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (creator)
              </Typography>
            </Stack>

            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              size="small"
              sx={{ minWidth: 150 }}
            >
              Message Admin
            </Button>
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
