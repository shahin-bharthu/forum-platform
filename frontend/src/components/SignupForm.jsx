import classes from "./AuthForm.module.css";
import { useRef, useState } from "react";
import InputField from "./TextInputField";
import PasswordInputField from "./PasswordInputField";
import CustomButton from "./Button";
import AuthFormHeader from "./AuthFormHeader";
import AuthFormFooter from "./AuthFormFooter";
import axios from 'axios';
import { z } from 'zod';
import PositionedSnackbar from "./SnackBar";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification, setNotification } from "../store/uiSlice";
import { Button, Divider } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const usernameInput = useRef();
  const passwordInput = useRef();
  const emailInput = useRef();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const notification = useSelector(state=>state.ui.notification);

  const dispatch = useDispatch();

  const userSchema = z.object({
    username: z.string()
      .min(3, "Username must be at least 3 characters long")
      .regex(/^[a-z0-9_]+$/, "Invalid username")
      .superRefine((val, ctx) => {
        if (val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Username is required",
          });
        }
      }),
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
    password: z.string()
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
      .superRefine((val, ctx) => {

        if (val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password is required'
          })
        }
        if (val.length > 0 && val.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password must be at least 8 characters'
          })
        }
        if (val.toLowerCase().includes("password")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password cannot contain the word 'password'",
          });
        }
      }),
  });

  const responseGoogle = async (authResult) => {
		try {      
			if (authResult["code"]) {
				await axios.get(`http://localhost:8080/auth/google?code=${authResult["code"]}`, {
          withCredentials: true
        });
				navigate('/user/dashboard');
			} else {
				throw new Error(authResult);
			}
		} catch (e) {
			console.log('Error while Google Login...', e);
      setErrorMessage(e.response.data.message || "An error occured. Please try again later");
		}
	};

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  })

  const validateForm = (formData) => {
    try {
      userSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleInputFocus = (event) => {
    const { name } = event.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  async function submitHandler(event) {
    event.preventDefault();

    const username = usernameInput.current.value.trim();
    const password = passwordInput.current.value.trim();
    const email = emailInput.current.value.trim();

    const formData = { username, password, email };

    if (!validateForm(formData)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:8080/auth/signup", formData, {
        "Content-Type": "application/json",
        withCredentials: true
      })

      console.log(response);
      setIsSubmitting(false);
      dispatch(setNotification({message:response.data.message, type:'success'}))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 1500);
    } catch (error) {
      console.error("Error: ", error);
      setIsSubmitting(false);
      dispatch(setNotification({message:error.response.data.message || "An error occurred. Please try again later.", type:'error'}))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 1500);
    }
  }

  return (
    <div className={classes["auth-page"]}>
      <AuthFormHeader authHeading='Sign Up' authPara='sign up' />
      <form onSubmit={submitHandler} className={classes["auth-form"]} noValidate>
      {notification.message && (
          <PositionedSnackbar message={notification.message} type={notification.type}/>
        )}
        <Button
          startIcon={<GoogleIcon/>}
          onClick = {googleLogin}
          variant="outlined"
          size="small"
          disabled={isSubmitting}
        >{isSubmitting ? "Logging you in..." : "Sign Up with Google"}</Button>
        <Divider>or</Divider>

        <InputField
          label="Username"
          type="text"
          name="username"
          placeholder="Set a username for your account"
          reference={usernameInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          help={errors.username}
          error={errors.username ? true:false}
        />

        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          reference={emailInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          help={errors.email}
          error={errors.email ? true:false}
        />

        <PasswordInputField
          label="Password"
          type="password"
          name="password"
          placeholder="Set a strong password"
          reference={passwordInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          help={errors.password}
          error={errors.password ? true: false}
        />
        <CustomButton
          type="submit"
          label={isSubmitting ? "Signing you in..." : "Sign Up"}
          disabled={isSubmitting}
        />
      </form>
      <AuthFormFooter authPara='Already have an account? ' authLink='/login/201' authLabelLink='Login' />
    </div>
  );
};

export default SignupForm;