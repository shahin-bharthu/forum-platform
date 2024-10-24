import { useCallback, useEffect, useState } from "react";
import { 
  Card, 
  Typography, 
  Avatar, 
  Badge, 
  Button, 
  Box, 
  Modal, 
  IconButton,
  Stack
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: 'none'
  },
  previewContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    mt: 2
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    mt: 2
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

export default function ProfileCard(props) {
  const [open, setOpen] = useState(false)

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [avatar, setAvatar]=useState(null)
  const [avatrUrl,setAvatarUrl]=useState(null)

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      const data = await handleFileRead();
    }
    
    fetchAvatar().catch(console.error);
  }, [])

  //To preview the selected image and it's url before upload
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileRead = async() => {
    const file = await axios.get(
      `http://localhost:8080/user/avatar/`,
      {
        withCredentials: true,
        responseType: 'blob'
      }
    );
    
    if (file.data) {
      setAvatar(file.data);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file.data);
    }
  };

  //Handles the submit of the aavtar image to send to the backend
  const handleFileUpload = useCallback(async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedFile);
    formData.append("email", props.email);
  
    try {
      const response = await axios.put(
        `http://localhost:8080/user/update/avatar/${props.id}`,
        formData, 
        {
          withCredentials: true
        }
      );
      handleClose();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }, [props.id, props.email, selectedFile]);
  
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
              <IconButton onClick={handleOpen}>
                <PhotoCameraIcon sx={{
                  backgroundColor: '#eeeeee',
                  borderRadius: "50%",
                  padding: ".2rem",
                  width: 30,
                  height: 30,
                  color: '#1e88e5'
                }} />
              </IconButton>
            }
          >
            <Avatar
              sx={{ width: 100, height: 100, mb: 1.5 }}
              // "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=338&ext=jpg&ga=GA1.1.1887574231.1729123200&semt=ais_hybrid"
              src={avatrUrl || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=338&ext=jpg&ga=GA1.1.1887574231.1729123200&semt=ais_hybrid"}
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
            {/* <Typography style={styles.details}>Detail ID</Typography> */}
            <Typography style={styles.details}>Detail 1</Typography>
            <Typography style={styles.details}>Detail 2</Typography>
            <Typography style={styles.details}>Detail 3</Typography>
          </Grid>
          {/* VALUES */}
          <Grid sx={{ textAlign: "end" }}>
            {/* <Typography style={styles.value}>{props.id}</Typography> */}
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="upload-modal-title"
      >
        <Box sx={styles.modal}>
          <Typography 
            id="upload-modal-title" 
            variant="h6" 
            component="h2" 
            sx={{ mb: 3 }}
          >
            Upload Profile Photo
          </Typography>

          {/* Preview Container */}
          {previewUrl && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar
                src={previewUrl}
                sx={{ width: 120, height: 120 }}
              />
            </Box>
          )}

          <form onSubmit={handleFileUpload}>
            <Stack spacing={2} alignItems="center">
              <Box sx={styles.buttonContainer}>
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  id="file-input"
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-input">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                  >
                    Choose File
                  </Button>
                </label>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!selectedFile}
                >
                  Upload Avatar
                </Button>
              </Box>
              
              {selectedFile && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Selected: {selectedFile.name}
                </Typography>
              )}
            </Stack>
          </form>
        </Box>
      </Modal>
    </Card>
  );
}



// const handleFileUpload = async (event, id, email) => {
//   event.preventDefault();
//   console.log("onsubmit", typeof (event.target));

//   const formData = new FormData(event.target);
//   formData.append("email", email)
//   console.log(formData.get('avatar'));

//   const response = await axios.put(
//     "http://localhost:8080/user/update/avatar/" + id,
//     formData,
//     {}
//   );
// }