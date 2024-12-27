import { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Badge,
  Button,
  Box,
  Modal,
  IconButton,
  Stack,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../utils/axiosInstance";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ForumBannerUpload = ({ forumId }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [bannerUrl, setBannerUrl] = useState(null);
  const [banner, setBanner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvatar = async () => {
      await handleFileRead();
    };

    fetchAvatar().catch(console.error);
  }, []);

  // Handle opening and closing the modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Preview the selected image before upload
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

  // Handle file upload
  const handleFileUpload = useCallback(
    async (event) => {
      event.preventDefault();
      if (!selectedFile) return;

      const formData = new FormData();
      formData.append("banner", selectedFile);
      console.log(selectedFile);
      
      console.log(formData);

      try {
        const response = await axiosInstance.put(`/forum/banner/${forumId}`,formData);
        console.log("FORUM BANNER UPLOAD RES: ",response);
        
        handleClose();
        setUpdateMessage(response.data.message);
        // setTimeout(() => {
        //   // window.location.reload(); // Reload the page to reflect the changes
        //   setUpdateMessage();
        // }, 1500);
      } catch (error) {
        setUpdateMessage(error.response.data.message);
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 3000);
      }
    },
    [forumId, selectedFile]
  );

  const handleFileRead = async () => {
    const file = await axiosInstance.get(`/forum/banner/${forumId}`, 
      {
      responseType: "blob",
      }
    );

    if (file.data) {
      setBanner(file.data);
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
            "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=338&ext=jpg&ga=GA1.1.1887574231.1729123200&semt=ais_hybrid"
          }
        ></Avatar>
      </Badge>

      {/* <Button
        variant="outlined"
        onClick={handleOpen}
        startIcon={<CloudUploadIcon />}
      >
        Upload Banner
      </Button> */}

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
            width: 400,
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

          <form onSubmit={handleFileUpload}>
            <Stack spacing={2} alignItems="center">
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
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
                  Upload Banner
                </Button>
              </Box>

              {selectedFile && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Selected: {selectedFile.name}
                </Typography>
              )}
            </Stack>
          </form>

        </Box>
      </Modal>
          {updateMessage && (
            // <Typography variant="body2" color="info" sx={{ mt: 2 }}>
              {updateMessage}
            // </Typography>
          )}
    </div>
  );
};

export default ForumBannerUpload;
