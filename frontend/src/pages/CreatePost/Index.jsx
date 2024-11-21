import { useRef, useState } from "react";
import CustomButton from "../../components/Button";
import TextAreaInputField from "./Components/TextAreaInput.jsx";
import TextInputField from "./Components/TextInput.jsx";
import axios from "axios";
import Button from "@mui/material/Button";
import { useLocation, useNavigate, useRouteLoaderData } from "react-router-dom";
import SelectList from "./Components/SelectList.jsx";
import Stack from '@mui/material/Stack';
import { Card } from "@mui/material";

const CreatePost = () => {
  const token = useRouteLoaderData('root');
  const titleInput = useRef();
  const bodyInput = useRef();
  const location = useLocation();
  const {forumName, forumId} = location.state || null

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedForum, setSelectedForum] = useState(null); 

  const handleInputChange = (event) => {
    const { name } = event.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setErrorMessage("");
  };

  const handleInputFocus = (event) => {
    const { name } = event.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setErrorMessage("");
  };

  const getSelectedForumFromList = (selectedForumFromList) => {
    console.log(selectedForumFromList);
    setSelectedForum(selectedForumFromList || forumId); 
  };

  async function submitHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInput.current.value.trim();
    const enteredBody = bodyInput.current.value.trim();

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
        error.response?.data?.message || "An error occurred. Please try again later."
      );
    }
  }

  return (
    <Card variant="outlined" sx={{ m: 2, p: 3, justifyContent: 'left' }}>
      <h3>Create Post</h3>
      <form onSubmit={submitHandler}>

        <SelectList selectedForumName={forumName} getForum={getSelectedForumFromList}/>

        <TextInputField
          label="Title"
          type="text"
          name="title"
          placeholder="Title"
          reference={titleInput}
          // onChange={handleInputChange}
          // onFocus={handleInputFocus}
        />

        <TextAreaInputField
          label="Body"
          type="text"
          name="Body"
          placeholder="Body"
          reference={bodyInput}
          // onChange={handleInputChange}
          // onFocus={handleInputFocus}
        />

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

        <Stack spacing={2} direction="row" sx={{ m: 1, pt: 2, justifyContent: 'right' }}>
          <CustomButton
            type="submit"
            label={isSubmitting ? "Creating Post..." : "Create Post"}
            disabled={isSubmitting}
          />
          <Button disableElevation onClick={() => { navigate(-1) }}>
            Back
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default CreatePost;