/* eslint-disable react/prop-types */
import classes from "../../components/AuthForm.module.css";
import { useEffect, useRef, useState } from "react";
import TextInputField from "./Components/TextInput.jsx";
import TextAreaInputField from "./Components/TextAreaInput.jsx";
import CustomButton from "../../components/Button";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Card, CircularProgress, Stack } from "@mui/material";
import ForumBannerUpload from "./Components/BannerUpload.jsx";
import axiosInstance from "../../../utils/axiosInstance.js";
import { useDispatch } from "react-redux";
import { clearNotification, setNotification } from "../../store/slices/uiSlice.js";

const Index = ({isEdit}) => {
  const [forumData, setForumData] = useState();
  const nameInput = useRef();
  const purposeInput = useRef();
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(forumData ? forumData.isPublic : true); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const dispatch = useDispatch()
  
  useEffect(() => {
    async function forumDetailsLoader(forum_id) {
      if (forum_id) {
        const response = await axiosInstance.get(`/forum/forum-id/${forum_id}`);  
        setForumData(response.data.data);
      }
      else {
        dispatch(setNotification({message: "Error fetching forum details. Please try again later!", type: "error"}));
        setTimeout(() => {
          dispatch(clearNotification());
        }, 5000);
      }
    }

    if (isEdit) {
      forumDetailsLoader(params.forum_id).then(() => setLoading(false));
    }

  }, [params.forum_id, isEdit]);

  const handleInputChange = (event) => {
    const { name } = event.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleInputFocus = (event) => {
    const { name } = event.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSwitchToggle = (event) => { 
    // eslint-disable-next-line no-unused-vars
    setIsPublic(prevState => event.target.checked);
  };

  async function createForumHandler(event) {
    event.preventDefault();    

    const enteredName = nameInput.current.value.trim();
    const enteredPurpose = purposeInput.current.value.trim();
    const forumIsPublic = isPublic; 

    const formData = { name: enteredName, purpose: enteredPurpose, isPublic: forumIsPublic };
    
    setErrors({});

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/forum", formData);
      dispatch(setNotification({message:response.data.message, type:'success'}))
      setIsSubmitting(false);
      setTimeout(() => {
        dispatch(clearNotification())
        navigate('/user/my-forums')
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      dispatch(setNotification({message:error.response?.data?.errors[0].msg || "An error occurred. Please try again later.", type:'error'}))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 1000);
    }
  }

  async function editForumHandler(event, id, forum_id) {
    event.preventDefault();
    
    const enteredPurpose = purposeInput.current.value.trim();
    const forumIsPublic = isPublic; 

    const formData = { purpose: enteredPurpose, isPublic: forumIsPublic };

    setErrors({});

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.patch(`/forum/${id}`, formData);
      
      setIsSubmitting(false);
      dispatch(setNotification({message:response.data.message, type:'success'}))
      setTimeout(() => {
        dispatch(clearNotification())
        navigate(`/forum/${forum_id}`)
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      dispatch(setNotification({message:error.response?.data?.errors[0].msg || "An error occurred. Please try again later.", type:'error'}))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 1000);
    }
  }

  const handleFormReset = (e) => {
    e.preventDefault()
    purposeInput.current.value = null;
    nameInput.current.value = null;
  }

  return (
    loading && isEdit ? <CircularProgress/> : 
    <Card variant="outlined" sx={{ m:2,p:3,justifyContent: 'left' }}>
      <h3 className={classes["heading"]}>{isEdit? 'Edit': 'Create'} Forum</h3>
      {isEdit && <ForumBannerUpload forumId={forumData.id}></ForumBannerUpload>}
      <form onSubmit={ isEdit? (event) => editForumHandler(event, forumData.id, forumData.forum_id) : createForumHandler } noValidate> 
        {errors.name && <p className={classes["error-message"]}>{errors.name}</p>}
        <TextInputField
          label="Name"
          type="text"
          name="name"
          placeholder="Enter forum name"
          reference={nameInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          isDisabled={isEdit}
          value={isEdit? forumData.name:null}
        />
        <TextAreaInputField
          label="Purpose"
          type="text"
          name="purpose"
          placeholder="Enter forum purpose"
          reference={purposeInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          value={isEdit ? forumData.purpose:null}
        />

        <FormControlLabel 
          control={<Switch checked={isPublic} onClick={handleSwitchToggle} />} 
          label="Keep forum public" 
        />
        
        <Stack spacing={2} direction="row" sx={{m:1,pt:2, justifyContent:'center'}}>
        <CustomButton
          type="submit"
          label={isEdit ? "Edit Forum" : "Create Forum"}
          disabled={isSubmitting}
        />
        {!isEdit && <Button disableElevation onClick={handleFormReset}>
          Reset
        </Button>}
        </Stack>
      </form>
    </Card>
  );
};

export default Index;