  import { useState, useRef, useEffect } from "react";
  import Popper from "@mui/material/Popper";
  import Paper from "@mui/material/Paper";
  import Typography from "@mui/material/Typography";
  import { useQuery, useQueryClient } from "@tanstack/react-query";
  import { Box, CircularProgress, Divider, Link } from "@mui/material";
  import axios from "axios";

  const fetchForum = async (forum_id) => {
    const forumData = await axios.get(`http://localhost:8080/forum/forum-id/${forum_id}`, {
      "Content-Type": "application/json",
      withCredentials: true,
    });
    const forum = forumData.data.data;
    const forumImageResponse = await axios.get(
      `http://localhost:8080/forum/banner/${forum.id}`,
      {
        responseType: "blob",
        withCredentials: true,
      }
    );
    const forumImage = URL.createObjectURL(forumImageResponse.data);    
    return {...forum, forumImage}
  };

  export function ForumHoverCard({ forum_id, forumname, ispostDetails }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const hoverTimeout = useRef(null);

    const triggerRef = useRef(null);

    const queryClient = useQueryClient();

    useEffect(() => {
      queryClient.prefetchQuery(["forum", forum_id], () => fetchForum(forum_id));
    }, [forum_id]);

    const { data, isLoading } = useQuery({
      queryKey: ["forum", forum_id],
      queryFn: () => fetchForum(forum_id),
      enabled: !!open,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    const handleMouseEnter = (event) => {
      hoverTimeout.current = setTimeout(() => {
        setAnchorEl(triggerRef.current);
        setOpen(true);
      }, 300); // 300ms delay
    };

    const handleMouseLeave = () => {
      clearTimeout(hoverTimeout.current);
      setOpen(false);
    };

    return (
      <>
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
          <div style={{ display: "inline-block" }} ref={triggerRef}>
            <Link
              href={`/forum/${forum_id}`}
              color="inherit"
              underline="hover"
              fontSize={14}
            >
              <Typography
                sx={ispostDetails? {display: "inline",
                  cursor: "pointer",fontWeight:200, fontSize:"0.85rem"}: {
                  display: "inline",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                {forumname}
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
                backgroundColor: "secondary.light",
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
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  <span style={{ display: "flex", gap: "8px" }}>
                    <img
                      src={data.forumImage}
                      alt="Forum Avatar"
                      style={{
                        width: "15%",
                        height: "auto",
                        borderRadius: "150px",
                        marginBottom: "8px",
                      }}
                    />
                    <Link
                      href={`/forum/${data.forum_id}`}
                      color="inherit"
                      underline="hover"
                      sx={{ mx: 2, my: "auto" }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                      >
                        {data.name}
                      </Typography>
                    </Link>
                  </span>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, textAlign: "justify" }}
                  >
                    {data.purpose}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <span style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                    <Typography variant="caption">
                      Memebers: {data.subscriber_count}
                    </Typography>
                    <Typography variant="caption">
                      Posts: {data.posts_count}
                    </Typography>
                  </span>
                </>
              )}
            </Paper>
          </Popper>
        </div>
      </>
    );
  }
