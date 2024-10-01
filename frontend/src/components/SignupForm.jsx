import classes from './SignupForm.module.css'

import { useRef, useState } from "react";
import InputField from "./Input";
import Button from "./Button";

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
      const response = await fetch("http://localhost:8080/user/signup", {
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
    <div className={classes['signup-page']} >
        <form onSubmit={submitHandler} className={classes['signup-form']}>
      {errorMessage && <div className={classes['error-message']}>{errorMessage}</div>}
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
      <InputField
        label="Password"
        type="password"
        name="password"
        placeholder="Set a strong password"
        reference={passwordInput}
      />
      <Button
        type="submit"
        label={isSubmitting ? "Submitting..." : "Submit"}
        disabled={isSubmitting}
      />
    </form>
    </div>
  );
};

export default SignupForm;
