import { useRef, useState } from "react";
import CustomButton from "../../components/Button";
import TextAreaInputField from "./Components/TextAreaInput.jsx";
import TextInputField from "./Components/TextInput.jsx";
import axios from "axios";
import { z } from "zod";
import Button from "@mui/material/Button";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import Asynchronous from "./Components/SelectList";
import Stack from '@mui/material/Stack';
import { Box, Card } from "@mui/material";

const CreatePost = () => {
  const token = useRouteLoaderData('root');
  const titleInput = useRef();
  const bodyInput = useRef();

  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

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

  async function submitHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInput.current.value.trim();
    const enteredBody = bodyInput.current.value.trim();

    const formData = { title: enteredTitle, body: enteredBody }

    // if (!validateForm(formData)) {
    //   return;
    // }
    setErrorMessage("");
    setErrors({});

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:8080/forumgfd", formData, {
        "Content-Type": "application/json",
        withCredentials: true
      })
      setSuccessMessage(response.data.message);

      //   setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again later."
      );
    }
  }

  return (
    <Card variant="outlined" sx={{ m:2,p:3,justifyContent: 'left' }}>
      <h3>Create Post</h3>
      <Asynchronous />
      <TextInputField
        label="Title "
        type="text"
        name="title"
        placeholder="Title"
        reference={titleInput}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      <TextAreaInputField
        label="Body"
        type="text"
        name="Body"
        placeholder="Body"
        reference={bodyInput}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      {/* <br /> */}

      <Stack spacing={2} direction="row" sx={{m:1,pt:2, justifyContent:'right'}}>
        <CustomButton
          type="submit"
          label={isSubmitting ? "Creating Post" : "Create Post"}
          disabled={isSubmitting}
        />
        <Button disableElevation onClick={() => { navigate('/user/dashboard') }}>
          Back
        </Button>
      </Stack>
    </Card>
  );
};

export default CreatePost;


