import classes from "../../components/AuthForm.module.css";
import { useRef, useState } from "react";
import InputField from "../../components/TextInputField";
import CustomButton from "../../components/Button";
import axios from "axios";
import { z } from "zod";
import Button from "@mui/material/Button";
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import Avatar from "@mui/material/Avatar";
import { blue } from "@mui/material/colors";
import { Navigate, useRouteLoaderData } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearNotification, setNotification } from "../../store/uiSlice.js";

const Index = () => {
  const token = useRouteLoaderData('root');
  const emailInput = useRef();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch()

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
  };

  const handleInputFocus = (event) => {
    const { name } = event.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInput.current.value.trim();
    const formData = { email: enteredEmail }

    if (!validateForm(formData)) {
      return;
    }
    setErrors({});

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:8080/auth/forgot-password", formData, {
        "Content-Type": "application/json",
        withCredentials: true
      })
      dispatch(setNotification({message:response.data.message, type:'success'}))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      dispatch(setNotification({message:error.response?.data?.message || "An error occurred. Please try again later.", type:'error'}))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 1500);
    }
  }

  return (

    <div className={classes["auth-page"]}>
      {token && <Navigate to="/user/dashboard" />}
      {!token &&
        <>
          <Avatar sx={{ bgcolor: blue[600] }}>
            <LockPersonOutlinedIcon sx={{ fontSize: 25 }} />
          </Avatar>
          <h3 className={classes["heading"]}>Forgot Password</h3>
          <form onSubmit={submitHandler} className={classes["auth-form"]} noValidate>
            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              reference={emailInput}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              help={errors.email}
              error={errors.email ? true : false}
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
        </>}
    </div>
  );
};

export default Index;
