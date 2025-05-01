import { useRouteLoaderData } from "react-router-dom";
import { Box, Button, Container, Typography, Paper, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
const ErrorPage = () => {
  const token = useRouteLoaderData("root");
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (token) {
      navigate("/user/dashboard");
    } else {
      navigate("/login/201"); // or navigate to a public home page
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            mx:2,
            p: 6,
            borderRadius: 2,
            background: " #e6eaf0",
            width: "100%",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.25rem", md: "5.5rem" },
              fontWeight: 700,
              color: "primary.main",
              mb: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            404
          </Typography>
          <Avatar
            alt="Page not found"
            src="/no-results-found.gif"
            sx={{
              width: 600,
              height: "auto",
              margin: "0 auto",
              borderRadius: "0%",
            }}
          />

          <Typography
            variant="h5"
            sx={{
              m: 2,
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "text.secondary",
              maxWidth: "80%",
              mx: "auto",
            }}
          >
            Oops! The page you are looking for doesn't exist or has been moved.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleNavigation}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "0 4px 14px 0 #5C5F7A",
              }}
            >
              {token ? "Back to Dashboard" : "Back to Home"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ErrorPage;
