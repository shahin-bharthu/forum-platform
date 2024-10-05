import classes from "./AuthForm.module.css";
import { useRef, useState } from "react";
import InputField from "./TextInputField";
import PasswordInputField from "./PasswordInputField";
import Button from "./Button";
import AuthFormHeader from "./AuthFormHeader";
import AuthFormFooter from "./AuthFormFooter";
import { z } from 'zod';

const SignupForm = () => {
  const usernameInput = useRef();
  const passwordInput = useRef();
  const emailInput = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  async function submitHandler(event) {
    event.preventDefault();
    const username = usernameInput.current.value.trim();
    const password = passwordInput.current.value.trim();
    const email = emailInput.current.value.trim();

    if (!username || !password || !email) {
      setErrorMessage("All fields are required!");
      return;
    }

    const formData = { username, password, email };
    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setIsSubmitting(false);

      if (response.ok) {
        alert("User registered successfully!");
      } else {
        setErrorMessage(result.message || "Something went wrong!");
      }
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage("An error occurred. Please try again later.");
      console.error("Error:", error);
    }
  }

  return (
    <div className={classes["auth-page"]}>
      <AuthFormHeader authHeading='Sign Up' authPara='sign in' />
      <form onSubmit={submitHandler} className={classes["auth-form"]}>
        {errorMessage && (
          <div className={classes["error-message"]}>{errorMessage}</div>
        )}
        <InputField
          label="Username"
          type="text"
          name="username"
          placeholder="Set a username for your account"
          reference={usernameInput}
        />
        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          reference={emailInput}
        />
        <PasswordInputField
          label="Password"
          type="password"
          name="password"
          placeholder="Set a strong password"
          reference={passwordInput}
        />
        <Button
          type="submit"
          label={isSubmitting ? "Signing you in..." : "Sign Up"}
          disabled={isSubmitting}
        />
      </form>
      <AuthFormFooter authPara='Already have an account? ' authLink='/login' authLabelLink='Login'/>
    </div>
  );
};

export default SignupForm;
