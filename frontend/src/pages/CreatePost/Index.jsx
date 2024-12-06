import classes from "../../components/AuthForm.module.css";
import { useEffect, useRef, useState } from "react";
import CustomButton from "../../components/Button";
import TextAreaInputField from "./Components/TextAreaInput.jsx";
import TextInputField from "./Components/TextInput.jsx";
import axios from "axios";
import Button from "@mui/material/Button";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import SelectList from "./Components/SelectList.jsx";
import Stack from '@mui/material/Stack';
import { Card } from "@mui/material";

const CreatePost = ({isEdit}) => {
  const topicData = useLoaderData();
  const titleInput = useRef();
  const bodyInput = useRef();
  const location = useLocation();
  const {forumName, forumId} = location.state || null || topicData.topic.forum_id

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedForum, setSelectedForum] = useState(null);

  useEffect(() => {
    if (forumName !== null && forumId !== null) {
      setSelectedForum(forumId)
    }
  }, []);

  const getSelectedForumFromList = (selectedForumFromList) => {
    // console.log(selectedForumFromList);
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
    console.log(formData);

    setErrorMessage("");
    setErrors({});

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:8080/topic", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
      setSuccessMessage(response.data.message);
      navigate(-1); 
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      setErrorMessage(
        error.response?.data?.errors[0].msg || "An error occurred. Please try again later."
      );
    }
  }

  async function editPostHandler(event, id) {
    event.preventDefault();
    
    const enteredTitle = titleInput.current.value.trim();
    const enteredBody = bodyInput.current.value

    const formData = {title:enteredTitle, content: enteredBody};
    
    setErrorMessage("");
    setErrors({});

    try {
      setIsSubmitting(true);
      
      const response = await axios.patch(`http://localhost:8080/topic/${id}`, formData, {
        "Content-Type": "application/json",
        withCredentials: true
      });
      
      setSuccessMessage(response.data.message);
      setIsSubmitting(false);
      setTimeout(() => {
        navigate(`/post/my-posts`)
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again later."
      );
    }
  }

  return (
    <Card variant="outlined" sx={{ m: 2, p: 3, justifyContent: 'left' }}>
      <h3 className={classes["heading"]}>{isEdit? 'Edit': 'Create'} Post</h3>
      <form onSubmit={isEdit? (event)=>editPostHandler(event, topicData.topic.id):  addPostHandler} noValidate>

        {!isEdit && <SelectList selectedForumName={forumName} getForum={getSelectedForumFromList}/>}

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

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

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

export const topicDetailsLoader = async ({request, params}) => {
  const topicId = params.id
  if (topicId) {
    const response = await axios.get(`http://localhost:8080/topic/${topicId}`, {withCredentials: true});    
    return response.data.data;
  }
  else {
    return null;
  }
}