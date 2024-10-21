import { useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid2';
import Avatar from "@mui/material/Avatar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from "axios";

const styles = {
  details: {
    padding: "1rem",
    borderTop: "1px solid #e1e1e1"
  },
  value: {
    padding: "1rem 2rem",
    borderTop: "1px solid #e1e1e1",
    color: "#899499"
  }
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
 const handleFileUpload = async (event, id, email)=>{
  event.preventDefault();
  console.log("onsubmit", typeof(event.target));
  
  const formData = new FormData(event.target);
  formData.append("email", email)
  console.log(formData.get('avatar'));
  
  const response = await axios.put(
    "http://localhost:8080/user/update/avatar/" + id,
    formData,
    {}
  );
 }

export default function ProfileCard(props) {

  return (
    <Card variant="outlined">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {/* CARD HEADER START */}
        <Grid sx={{ p: "1.5rem 0rem", textAlign: "center" }}>
          {/* PROFILE PHOTO */}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <IconButton component="label" aria-label="delete">
                <PhotoCameraIcon sx={{
                  backgroundColor: '#eeeeee',
                  borderRadius: "50%",
                  padding: ".2rem",
                  width: 30,
                  height: 30,
                  color: '#1e88e5'
                }} />
                <form onSubmit={(e) => handleFileUpload(e, props.id, props.email)} encType="multipart/form-data">
                <VisuallyHiddenInput
                  type="file"
                  single
                  name="avatar"
                />
                <button type="submit">Upload Avatar</button>
                </form>
              </IconButton>
            }
          >
            <Avatar
              sx={{ width: 100, height: 100, mb: 1.5 }}
              src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=338&ext=jpg&ga=GA1.1.1887574231.1729123200&semt=ais_hybrid"
            ></Avatar>
          </Badge>

          {/* DESCRIPTION */}
          <Typography variant="h6">{props.name}</Typography>
          <Typography color="text.primary">{props.sub}</Typography>
        </Grid>
        {/* CARD HEADER END */}

        {/* DETAILS */}
        <Grid container>
          <Grid >
          <Typography style={styles.details}>Detail ID</Typography>
            <Typography style={styles.details}>Detail 1</Typography>
            <Typography style={styles.details}>Detail 2</Typography>
            <Typography style={styles.details}>Detail 3</Typography>
          </Grid>
          {/* VALUES */}
          <Grid sx={{ textAlign: "end" }}>
          <Typography style={styles.value}>{props.id}</Typography>
            <Typography style={styles.value}>{props.dt1}</Typography>
            <Typography style={styles.value}>{props.dt2}</Typography>
            <Typography style={styles.value}>{props.dt3}</Typography>
          </Grid>
        </Grid>

        {/* BUTTON */}
        <Grid container sx={{ width: "100%" }} style={styles.details}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "99%", p: 1, my: 2 }}
          >
            View Public Profile
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
