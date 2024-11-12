import classes from "../../components/AuthForm.module.css";
import { useRef, useState } from "react";
import TextInputField from "./Components/TextInput.jsx";
import TextAreaInputField from "./Components/TextAreaInput.jsx";
import CustomButton from "../../components/Button";
import axios from "axios";
import { z } from "zod";
import Button from "@mui/material/Button";
import { Navigate, useLoaderData, useNavigate, useRouteLoaderData } from "react-router-dom";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const Index = ({isEdit}) => {
  const token = useRouteLoaderData('root');
  const forumData = useLoaderData();
  const nameInput = useRef();
  const purposeInput = useRef();

  const navigate=useNavigate()
  const [isPublic, setIsPublic] = useState(true); // Default to true
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

  const handleSwitchToggle = (event) => {
    setIsPublic(event.target.checked);
  };

  async function createForumHandler(event) {
    event.preventDefault();
    console.log("in create");
    

    const enteredName = nameInput.current.value.trim();
    const enteredPurpose = purposeInput.current.value.trim();
    const forumIsPublic = isPublic; 

    const formData = { name: enteredName, purpose: enteredPurpose, isPublic: forumIsPublic };
    console.log(formData);
    
    if (!validateForm(formData)) {      
      return;
    }
    setErrorMessage("");
    setErrors({});

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:8080/forum", formData, {
        "Content-Type": "application/json",
        withCredentials: true
      });
      setSuccessMessage(response.data.message);
      setIsSubmitting(false);
      setTimeout(() => {
        navigate('/user/my-forums')
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again later."
      );
    }
  }

  async function editForumHandler(event, id, forum_id) {
    event.preventDefault();
    console.log("in edit");
    
    const enteredPurpose = purposeInput.current.value.trim();
    const forumIsPublic = isPublic; 

    const formData = { purpose: enteredPurpose, isPublic: forumIsPublic };
    console.log(formData);
    
    // if (!validateForm(formData)) {      
    //   return;
    // }
    setErrorMessage("");
    setErrors({});

    try {
      setIsSubmitting(true);
      const response = await axios.patch(`http://localhost:8080/forum/${id}`, formData, {
        "Content-Type": "application/json",
        withCredentials: true
      });
      setSuccessMessage(response.data.message);
      setIsSubmitting(false);
      setTimeout(() => {
        navigate(`/forum/${forum_id}`)
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again later."
      );
    }
  }

  const handleFormReset = (e) => {
    e.preventDefault()
    purposeInput.current.value = null,
    nameInput.current.value = null
  }

  return ( 
    <div>
      <h3 className={classes["heading"]}>{isEdit? 'Edit': 'Create'} Forum</h3>
      <form onSubmit={ isEdit? (event) => editForumHandler(event, forumData.id, forumData.forum_id) : createForumHandler } noValidate> 
        {successMessage && (
          <div className={classes["success-message"]}>{successMessage}</div>
        )}
        {errorMessage && (
          <div className={classes["error-message"]}>{errorMessage}</div>
        )}
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
          // isDisabled={isEdit}
          value={isEdit ? forumData.purpose:null}
        />
        <FormControlLabel 
          control={<Switch checked={isPublic} onChange={handleSwitchToggle} />} 
          label="Keep forum private" 
        />
        <br />
        <CustomButton
          type="submit"
          label={isEdit ? "Edit Forum" : "Create Forum"}
          disabled={isSubmitting}
        />
        <br /> <br />
        <Button disableElevation onClick={handleFormReset}>
          Reset
        </Button>
      </form>
    </div>
  );
};

export default Index;

export async function forumDetailsLoader({params}) {
  const forum_id = params.forum_id
  if (forum_id) {
    const response = await axios.get(`http://localhost:8080/forum/${forum_id}`, {withCredentials: true});
    console.log(response.data.data);
    // const forumData = response.data.data
    return response.data.data
  }
  else {
    return null;
  }
}