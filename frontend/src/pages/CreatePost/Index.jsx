import classes from "../../components/AuthForm.module.css";
import { useEffect, useRef, useState } from "react";
import CustomButton from "../../components/Button";
import TextAreaInputField from "./Components/TextAreaInput.jsx";
import TextInputField from "./Components/TextInput.jsx";
import Button from "@mui/material/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SelectList from "./Components/SelectList.jsx";
import Stack from '@mui/material/Stack';
import { Card, CircularProgress } from "@mui/material";
import axiosInstance from "../../../utils/axiosInstance.js";
import { useDispatch } from 'react-redux';
import { clearNotification, setNotification } from "../../store/uiSlice.js";

const CreatePost = ({isEdit}) => {
  const [topicData, setTopicData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // only used to show error for the fields of the form
  const [selectedForum, setSelectedForum] = useState(null);
  const [loading, setLoading] = useState(true);

  const titleInput = useRef();
  const bodyInput = useRef();
  const location = useLocation();
  const params = useParams();
  const {forumName, forumId} = location.state // || topicData.topic.forum_id

  const navigate = useNavigate();
  const dispatch=useDispatch()
  
  useEffect(() => {
    if (!isEdit && forumName !== null && forumId !== null) {
      setSelectedForum(forumId)
    }

    if (isEdit) {
      topicDetailsLoader(params.id).then(() => setLoading(false));
    }
  }, [params.id]);

  const topicDetailsLoader = async (topicId) => {
    if (topicId) {
      const response = await axiosInstance.get(`http://localhost:8080/topic/${topicId}`, {withCredentials: true});    
      setTopicData(response.data.data);
    }
    else {
      return null;
    }
  }

  const getSelectedForumFromList = (selectedForumFromList) => {
    setSelectedForum(selectedForumFromList ?? forumId); 
  };

  async function addPostHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInput.current.value.trim();
    const enteredBody = bodyInput.current.value

    if (!selectedForum) {
      setErrorMessage("Please select a forum.");
      return;
    }

    const formData = { 
      title: enteredTitle, 
      content: enteredBody, 
      forum_id: selectedForum 
    };

    setErrorMessage("");

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/topic", formData);
      
      dispatch(setNotification({message:response.data.message, type:"success"}))
      setTimeout(() => {
        dispatch(clearNotification())
        navigate(`/post/${response.data.data.id}`); 
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      dispatch(setNotification({message:error.response?.data?.errors?.[0]?.msg || "An error occurred. Please try again later.", type:'error'}))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 1500);
    }
  }

  async function editPostHandler(event, id) {
    event.preventDefault();
    
    const enteredTitle = titleInput.current.value.trim();
    const enteredBody = bodyInput.current.value

    const formData = {title:enteredTitle, content: enteredBody};
    
    setErrorMessage("");

    try {
      setIsSubmitting(true);
      
      const response = await axiosInstance.patch(`http://localhost:8080/topic/${id}`, formData, {
        "Content-Type": "application/json",
        withCredentials: true
      });
      
      dispatch(setNotification({message:response.data.message, type:"success"}))
      setIsSubmitting(false);
      setTimeout(() => {
        dispatch(clearNotification())
        navigate(`/post/my-posts`)
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      dispatch(setNotification({message:error.response?.data?.message || "An error occurred. Please try again later.", type:'error'}))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 1500);
    }
  }

  return (
    loading && isEdit ? <CircularProgress/> : 
    <Card variant="outlined" sx={{ m: 2, p: 3, justifyContent: 'left' }}>
      <h3 className={classes["heading"]}>{isEdit? 'Edit': 'Create'} Post</h3>
      <form onSubmit={isEdit? (event)=>editPostHandler(event, topicData.topic.id):  addPostHandler} noValidate>

        {!isEdit && <SelectList selectedForumName={forumName} getForum={getSelectedForumFromList}/>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <TextInputField
          label="Title"
          type="text"
          name="Title"
          placeholder={isEdit? null : 'Post Title'}
          reference={titleInput}
          isDisabled={isEdit}
          value={isEdit ? topicData.topic.title : null}
        />

        <TextAreaInputField
          label="Body"
          type="text"
          name="Body"
          placeholder={isEdit? null : 'Post Body'}
          reference={bodyInput}
          value={isEdit ? topicData.topic.content : null}
        />

        <Stack spacing={2} direction="row" sx={{ m: 1, pt: 2, justifyContent: 'right' }}>
          <CustomButton
            type="submit"
            label={isEdit ? "Edit Post" : "Create Post"}
          disabled={isSubmitting}
          />
          <Button disableElevation onClick={() => { navigate(-1) }}>
            Cancel
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default CreatePost;

export const topicDetailsLoader = async ({params}) => {
  const topicId = params.id
  if (topicId) {
    const response = await axiosInstance.get(`http://localhost:8080/topic/${topicId}`, {withCredentials: true});    
    return response.data.data;
  }
  else {
    return null;
  }
}