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
  const [errors, setErrors] = useState({});

  const userSchema = z.object({
    username: z.string()
      .min(3, "Username must be at least 3 characters long")
      .regex(/^[a-z0-9_]+$/, "Invalid username")
      .superRefine((val, ctx) => {
        if (val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email is required",
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

    const username = usernameInput.current.value.trim();
    const password = passwordInput.current.value.trim();
    const email = emailInput.current.value.trim();

    const formData = { username, password, email };

    if (!validateForm(formData)) {
      return;
    }

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
      <form onSubmit={submitHandler} className={classes["auth-form"]} noValidate>
        {errorMessage && (
          <div className={classes["error-message"]}>{errorMessage}</div>
        )}
        {errors.username && <p className={classes["error-message"]}>{errors.username}</p>}
        <InputField
          label="Username"
          type="text"
          name="username"
          placeholder="Set a username for your account"
          reference={usernameInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
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
          placeholder="Set a strong password"
          reference={passwordInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <Button
          type="submit"
          label={isSubmitting ? "Signing you in..." : "Sign Up"}
          disabled={isSubmitting}
        />
      </form>
      <AuthFormFooter authPara='Already have an account? ' authLink='/login' authLabelLink='Login' />
    </div>
  );
};

export default SignupForm;
