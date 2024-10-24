import classes from "./AuthForm.module.css";
import { useRef, useState, useEffect } from "react";
import InputField from "./TextInputField";
import PasswordInputField from "./PasswordInputField";
import CustomButton from "./Button";
import AuthFormHeader from "./AuthFormHeader";
import AuthFormFooter from "./AuthFormFooter";
import axios from "axios";
import { z } from "zod";
import { Link, useLoaderData, useNavigate, redirect } from "react-router-dom";
import PositionedSnackbar from "./SnackBar";

const LoginForm = () => {
  const emailInput = useRef();
  const passwordInput = useRef();
  const navigate = useNavigate();
  const {message} = useLoaderData()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (message === null) {
      navigate("/login/201");
    }
  }, [message, navigate]);

  const userSchema = z.object({
    email: z.string().superRefine((val, ctx) => {
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
    password: z.string().min(1, "Password is required"),
  });

  const validateForm = (formData) => {
    try {
      userSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
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
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        formData,
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/user/dashboard", { replace: true });
      }

      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(
        error.response.data.message ||
          "An error occurred. Please try again later."
      );
    }
  }

  return (
    <div className={classes["auth-page"]}>
      <AuthFormHeader authHeading="Login" authPara="login " />
      <form
        onSubmit={submitHandler}
        className={classes["auth-form"]}
        noValidate
      >
        {/* {message && (
          <div>{message}</div>
        )} */}
        {errorMessage && (
          <div className={classes["error-message"]}>{errorMessage}</div>
        )}
        {errors.email && (
          <p className={classes["error-message"]}>{errors.email}</p>
        )}
        {message && <PositionedSnackbar message={message} />}
        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          reference={emailInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {errors.password && (
          <p className={classes["error-message"]}>{errors.password}</p>
        )}
        <PasswordInputField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          reference={passwordInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <p className={classes["forgot-password"]}>
          <Link
            className={classes["constant-color-link"]}
            to="/forgot-password"
          >
            Forgot password?
          </Link>
        </p>
        <CustomButton
          type="submit"
          label={isSubmitting ? "Logging you in..." : "Login"}
          disabled={isSubmitting}
        />
      </form>
      <AuthFormFooter
        authPara="Don't have an account? "
        authLink="/signup"
        authLabelLink="Sign Up"
      />
    </div>
  );
};

export default LoginForm;

export async function loader({ request, params }) {
  const status = params.status;
  switch (status) {
    case "100":
      return {message: "No user found for this verification. Please sign up."};
    case "101":
      return {message: "User is already verified. Please log in."};
    case "102":
      return {message: "Invalid verification link. Please request a new one."};
    case "103":
      return {message: "The verification link has expired. Please request a new one."};
    case "104":
      return {message: "Couldn't update user's verification status. Please try again later."};
    case "201":
      return {message: null};
    case "200":
      return {message: "User verified successfully"};
    default:
      throw redirect("/login/201");
  }
}