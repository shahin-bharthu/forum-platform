import classes from "../../components/AuthForm.module.css";
import { useRef, useState } from "react";
import InputField from "../../components/TextInputField";
import CustomButton from "../../components/Button";
import axios from "axios";
import { z } from "zod";
import Button from "@mui/material/Button";
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import Avatar from "@mui/material/Avatar";
import {blue } from "@mui/material/colors";
import { Navigate, useRouteLoaderData } from "react-router-dom";
import MultipleSelectPlaceholder from "./Components/SelectList";
import TextInputField from "../../components/TextInputField";
import { Box } from "@mui/material";

const CreatePost = () => {
  const token = useRouteLoaderData('root');
  const nameInput = useRef();
  const purposeInput = useRef();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const userSchema = z.object({
    name: z.string()
      .superRefine((val, ctx) => {
        if (val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "name is required",
          });
        } else if (!z.string().safeParse(val).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid name",
          });
        }
      }),
  });

  const validateForm = (formData) => {
    try {
      userSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      console.log("ERROR IN VALIDATEFORM: ", error);
      
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

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

    const enteredname = nameInput.current.value.trim();
    const enteredPurpose = purposeInput.current.value.trim();

    const formData={name: enteredname, purpose: enteredPurpose}
    
    if (!validateForm( formData )) {      
      return;
    }
    setErrorMessage("");
    setErrors({});

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:8080/forum", formData, {
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
    <Box sx={{justifyContent:'left'}}>
      <h1>Create Post</h1>
      <MultipleSelectPlaceholder/>
      <InputField
          label="Name"
          type="text"
          name="name"
          placeholder="Enter forum name"
          reference={nameInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <br />
        <InputField
          label="Purpose"
          type="text"
          name="purpose"
          placeholder="Enter forum purpose"
          reference={purposeInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <br />
        <CustomButton
          type="submit"
          label={isSubmitting ? "Creating Forum" : "Create Forum"}
          disabled={isSubmitting}
        />
        <br />
        <Button href="dashboard" disableElevation>
          Back
        </Button>
    </Box>
  );
};

export default CreatePost;
