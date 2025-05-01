import { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Badge,
  Box,
  Modal,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { clearNotification, setNotification } from "../../../store/slices/uiSlice";
import defaultForumBanner from "../../../assets/defaultForumbanner.png";
import ImageUploadStepper from "../../../components/ImageUploadStepper";

const ForumBannerUpload = ({ forumId }) => {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [refresh, setRefresh] = useState(false) // used to reload the profile image compoent instead of window.location.reload() to avoid change of any other inputs

  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchAvatar = async () => {
      await handleFileRead();
    };

    fetchAvatar().catch(console.error);
  }, [refresh]);

  // Handle opening and closing the modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPreviewUrl(null);
  };

  // Handle file upload
  const handleFileUpload = useCallback(
    async (event) => {
      event.preventDefault();
      const file = event.target.files[0];
      
      if (!file) return;

      const formData = new FormData();
      formData.append('banner', file);

      try {
        const response = await axiosInstance.put(`/forum/banner/${forumId}`, formData);

        handleClose();
        dispatch(setNotification({ message: response.data.message, type: 'success' }))
        setTimeout(() => {
          dispatch(clearNotification())
          setRefresh(true) // to reload the forum banner image after upload
        }, 1500);
      } catch (error) {
        dispatch(setNotification({ message: error?.response.data.message, type: 'error' }))
        setTimeout(() => {
          dispatch(clearNotification())
          navigate('/user/dashboard');
        }, 3000);
      }
    },
    [forumId, refresh ,handleClose, navigate, dispatch]
  );

  const handleFileRead = async () => {
    const file = await axiosInstance.get(`/forum/banner/${forumId}`,
      {
        responseType: "blob",
      }
    );

    if (file.data) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result);
      };
      reader.readAsDataURL(file.data);
    }
  };

  return (
    <div>
      {/* PROFILE PHOTO */}
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <IconButton onClick={handleOpen}>
            <PhotoCameraIcon
              sx={{
                backgroundColor: "#eeeeee",
                borderRadius: "50%",
                padding: ".2rem",
                width: 30,
                height: 30,
                color: "#1e88e5",
              }}
            />
          </IconButton>
        }
      >
        <Avatar
          sx={{ width: 100, height: 100, mb: 1.5 }}
          src={
            bannerUrl ||
            defaultForumBanner
          }
        ></Avatar>
      </Badge>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="upload-modal-title"
      >
        <Box
          sx={{
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
          }}
        >
          <Typography
            id="upload-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 3 }}
          >
            Upload Banner
          </Typography>

          {/* Preview Selected Image */}
          {previewUrl && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: 120, height: 120, borderRadius: "50%" }}
              />
            </Box>
          )}
          <form onSubmit={(e) => e.preventDefault()}>
            <ImageUploadStepper handleFileUpload={handleFileUpload} />
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ForumBannerUpload;