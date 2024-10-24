import classes from "../../components/AuthForm.module.css";
import { useRef, useState } from "react";
import InputField from "../../components/TextInputField";
import CustomButton from "../../components/Button";
import Dashboard from "../Dashboard/Index.jsx";
import axios from "axios";
import { z } from "zod";
import Button from "@mui/material/Button";
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import Avatar from "@mui/material/Avatar";
import {blue } from "@mui/material/colors";
import { Navigate, useRouteLoaderData } from "react-router-dom";

const Index = () => {
  const token = useRouteLoaderData('root');
  const emailInput = useRef();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const userSchema = z.object({
    email: z.string()
      .superRefine((val, ctx) => {
        if (val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email is required",
          });
        } else if (!z.string().email().safeParse(val).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid email address",
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

    const enteredEmail = emailInput.current.value.trim();
    const formData={email:enteredEmail}
    
    if (!validateForm( formData )) {      
      return;
    }
    setErrorMessage("");
    setErrors({});

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:8080/auth/forgot-password", formData, {
        "Content-Type": "application/json",
        withCredentials: true
      })
      setSuccessMessage(response.data.message);
      
      // setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again later."
      );
    }
  }

  return ( 

    <div className={classes["auth-page"]}>
      {token && <Navigate to="/user/dashboard" />}
      {!token && 
      <>
      <Avatar sx={{ bgcolor: blue[600] }}>
        <LockPersonOutlinedIcon  sx={{ fontSize: 25 }}/>
      </Avatar>
      <h3 className={classes["heading"]}>Forgot Password</h3>
      <form onSubmit={submitHandler} className={classes["auth-form"]} noValidate>
        {successMessage && (
          <div className={classes["success-message"]}>{successMessage}</div>
        )}
        {errorMessage && (
          <div className={classes["error-message"]}>{errorMessage}</div>
        )}
        {errors.email && <p className={classes["error-message"]}>{errors.email}</p>}
        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          reference={emailInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <p>We’ll send a link to reset password to the email if it matches an existing account.</p>
        <CustomButton
          type="submit"
          label={isSubmitting ? "Email Sent" : "Send Mail"}
          disabled={isSubmitting}
        />
        <Button href="login/201" disableElevation>
          Back
        </Button>
      </form>
      </> }
    </div>
  );
};

export default Index;
