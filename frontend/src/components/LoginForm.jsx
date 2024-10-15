import classes from "./AuthForm.module.css";
import { useRef, useState } from "react";
import InputField from "./TextInputField";
import PasswordInputField from "./PasswordInputField";
import Button from "./Button";
import AuthFormHeader from "./AuthFormHeader";
import AuthFormFooter from "./AuthFormFooter";
import axios from 'axios';
import { z } from 'zod';

const LoginForm = () => {
  const emailInput = useRef();
  const passwordInput = useRef();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    password: z.string()
      .min(1, "Password is required")
  });

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
    setErrorMessage("");
  };

  const handleInputFocus = (event) => {
    const { name } = event.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    setErrorMessage("");
  };

  async function submitHandler(event) {
    event.preventDefault();

    const email = emailInput.current.value.trim();
    const password = passwordInput.current.value.trim();

    const formData = { password, email };

    if (!validateForm(formData)) {
      return;
    }

    setErrorMessage("");
    setErrors({});

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:8080/auth/login", formData, {
        "Content-Type": "application/json",
        withCredentials: true
      })

      console.log(response);
      setIsSubmitting(false);
      
    }
    catch (error) {
      setIsSubmitting(false);
      setErrorMessage( JSON.parse(error.response.data.message) ||"An error occurred. Please try again later.");
      console.error("Error:", error);
    }
  }


  /**
   * const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setIsSubmitting(false);

      if (response.ok) {
        alert("User logged in successfully!");
      } else {
        setErrorMessage(result.message || "Something went wrong!");
      }
   */

  return (
    <div className={classes["auth-page"]}>
      <AuthFormHeader authHeading='Login' authPara='login ' />
      <form onSubmit={submitHandler} className={classes["auth-form"]} noValidate>
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
        {errors.password && <p className={classes["error-message"]}>{errors.password}</p>}
        <PasswordInputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          reference={passwordInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <Button
          type="submit"
          label={isSubmitting ? "Logging you in..." : "Login"}
          disabled={isSubmitting}
        />
      </form>
      <AuthFormFooter authPara="Don't have an account? " authLink='/signup' authLabelLink='Sign Up' />
    </div>
  );
};

export default LoginForm;
