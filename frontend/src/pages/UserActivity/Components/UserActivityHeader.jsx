import { Avatar, Typography, Box } from "@mui/material";

const UserActivityHeader = ({ avatarUrl, username, name }) => {
  return (
    <Box display="flex" alignItems="center">
      <Avatar
        src={
          avatarUrl ||
          "https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww"
        }
        alt={username}
        sx={{ width: 90, height: 90, ml: 2 }}
      />
      <Box ml={4} mt={4} sx={{ justifyItems: "flex-start" }}>
        <Typography variant="h6">{username}</Typography>
        <Typography variant="subtitle1">{name}</Typography>
      </Box>
    </Box>
  );
};

export default UserActivityHeader;
