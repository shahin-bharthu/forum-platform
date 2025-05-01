import { useState, useRef, useEffect } from "react";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress, Link } from "@mui/material";
import axios from "axios";
import { CakeOutlined as CakeOutlinedIcon } from "@mui/icons-material";

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

const fetchUser = async (userId) => {
  const userData = await axios.get(`http://localhost:8080/user/${userId}`, {
    "Content-Type": "application/json",
    withCredentials: true,
  });
  const user = userData.data.user;

  const userAvatar = await axios.get(
    `http://localhost:8080/user/avatar/${userId}`,
    {
      responseType: "blob",
      withCredentials: true,
    }
  );
  const userImage = URL.createObjectURL(userAvatar.data);

  return { ...user, userImage };
};

export function UserHoverCard({ userId, username }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const hoverTimeout = useRef(null);

  const triggerRef = useRef(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery(["user", userId], () => fetchUser(userId));
  }, [userId]);

  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!open,
    staleTime: 5 * 60 * 1000, // store/Cache for 5 minutes
  });

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setAnchorEl(triggerRef.current);
      setOpen(true);
    }, 600); // 600ms delay
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setOpen(false);
  };

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div style={{ display: "inline-block" }} ref={triggerRef}>
          <Link
            href={`/user/${username}`}
            color="inherit"
            underline="hover"
            fontSize={14}
          >
            <Typography
              sx={{
                display: "inline",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              {username}
            </Typography>
          </Link>
        </div>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          disablePortal={true}
          sx={{
            zIndex: 1250,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              width: 280,
              maxWidth: "90vw",
              backgroundColor: "primary.light",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            {isLoading || !data ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight={80}
              >
                <CircularProgress color="secondary" size={24} />
              </Box>
            ) : (
              <>
                <div style={{ display: "flex", gap: "8px" }}>
                  <img
                    src={data.userImage}
                    alt="user Avatar"
                    style={{
                      width: "15%",
                      height: "auto",
                      borderRadius: "150px",
                      marginBottom: "8px",
                    }}
                  />
                  <span>
                    <Link
                      href={`/user/${data.username}`}
                      color="white"
                      underline="none"
                      sx={{ mt: 2, my: "auto" }}
                      fontSize={12}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {data.username}
                      </Typography>
                    </Link>
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      sx={{ mb: 0.5 }}
                      fontSize={10}
                      color="primary.contrastText"
                    >
                      {`${data.firstname} ${data.lastname}`}
                    </Typography>
                  </span>
                  <span style={{ display: "flex", margin: "auto"}}>
                    <CakeOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: "primary.contrastText",
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      sx={{ mx: 1 }}
                      fontSize={10}
                      color="primary.contrastText"
                    >
                      {formatDate(data.createdAt)}
                    </Typography>
                  </span>
                </div>
              </>
            )}
          </Paper>
        </Popper>
      </div>
    </>
  );
}
