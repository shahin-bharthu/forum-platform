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
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../../../store/slices/userSlice";
import { clearNotification, setNotification } from "../../../store/slices/uiSlice";
import axiosInstance from "../../../../utils/axiosInstance";
import defaultAvatar from "../../../assets/defaultAvatar.png"
import ImageUploadStepper from "../../../components/ImageUploadStepper";
import { useNavigate } from "react-router-dom";

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

export default function ProfileCard(props) {
  const [open, setOpen] = useState(false)

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleOpen = () => setOpen(true);

  const dispatch = useDispatch()
  const profilePhoto = useSelector(state => state.user.profilePhoto);

  const navigate = useNavigate()

  const handleClose = () => {
    setOpen(false);
    setPreviewUrl(null);
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      await handleFileRead();
    }

    fetchAvatar().catch(console.error);
  }, [])

  const handleFileRead = async () => {
    const file = await axiosInstance.get(`/user/avatar/`, { responseType: 'blob' });

    if (file.data) {
      const reader = new FileReader();
      dispatch(setUserProfile({
        profilePhoto: reader.result
      }));
      reader.readAsDataURL(file.data);
    }
  };

  //Handles the submit of the aavtar image to send to the backend
  const handleFileUpload = useCallback(async (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("email", props.email);

    try {
      const response = await axios.put(
        `http://localhost:8080/user/update/avatar/${props.id}`,
        formData,
        {
          withCredentials: true
        }
      );

      //Dispatching here again to update the state so that the components using the slice can be updated
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setUserProfile({
          profilePhoto: reader.result
        }));
      };
      reader.readAsDataURL(file);


      handleClose();
      dispatch(setNotification({ message: response.data.message, type: null }))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 1500);
    } catch (error) {
      dispatch(setNotification({ message: 'Error uploading file. Try again later!', type: 'error' }))
    } finally {
      setTimeout(() => {
        dispatch(clearNotification())
      }, 1500);
    }
  }, [props.id, props.email, dispatch]);

  return (
    <Card variant="outlined" sx={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)"}}>
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
                  color: "primary.main",
                }} />
              </IconButton>
            }
          >
            <Avatar
              sx={{ width: 100, height: 100, mb: 1.5 }}
              src={profilePhoto || defaultAvatar}
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
            <Typography style={styles.details}>No of Posts</Typography>
            <Typography style={styles.details}>User Since</Typography>
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
        <Grid container sx={{ width: "100%" }} style={styles.details} >
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "99%", p: 1, my: 2 }}
            onClick={()=>navigate(`/user/${props.sub}`)}
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
        <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: "none",
          }}>
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
          <form onSubmit={(e) => e.preventDefault()}>
            <ImageUploadStepper handleFileUpload={handleFileUpload} />
          </form>
        </Box>
      </Modal>
    </Card>
  );
}