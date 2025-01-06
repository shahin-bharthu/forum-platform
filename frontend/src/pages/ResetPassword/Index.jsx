import classes from "../../components/AuthForm.module.css";
import { useRef, useState } from "react";
import PasswordInputField from "../../components/PasswordInputField";
import CustomButton from "../../components/Button";
import axios from "axios";
import { z } from "zod";
import { useParams, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import {blue } from "@mui/material/colors";
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import PositionedSnackbar from "../../components/SnackBar";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification, setNotification } from "../../store/uiSlice";

const Index = () => {
    const passwordInput = useRef();
    const confirmPasswordInput = useRef();
    const { token } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});// used for validation error
    const notification = useSelector(state=>state.ui.notification)

    const resetPasswordScheme = z.object({
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
        confirmPassword: z.string()
            .superRefine((val, ctx) => {

                if (val.length === 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Password is required'
                    })
                }
            }),
    }).refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: "Passwords do not match",

    });

    const validateForm = (formData) => {
        try {
            resetPasswordScheme.parse(formData);
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

        const confirmPassword = confirmPasswordInput.current.value.trim();
        const password = passwordInput.current.value.trim();

        const formData = { password, confirmPassword };

        if (!validateForm(formData)) {
            return;
        }

        setErrors({});

        try {
            setIsSubmitting(true);
            const response = await axios.post(`http://localhost:8080/auth/reset-password/${token}`, formData, {
                "Content-Type": "application/json",
                withCredentials: true
            })
            
            if (response.status == 200) {
                dispatch(setNotification({message:"Your password has been reset! Login again to continue", type:'success'}))
                setTimeout(() => {
                    dispatch(clearNotification())
                    navigate("/login/201", { replace: true });
                }, 3000);
            }
        }
        catch (error) {
            setIsSubmitting(false);
            dispatch(setNotification({message:error.response.data.message || "An error occurred. Please try again later.", type:'error'}))
            console.error("Error:", error.response);
            setTimeout(() => {
                dispatch(clearNotification())
            }, 2000);
        }
    }

    return (
        <div className={classes["auth-page"]}>
            {notification.message && <PositionedSnackbar message={notification.message} type={notification.type}/>}
            <Avatar sx={{ bgcolor: blue[600] }}>
                <LockResetOutlinedIcon sx={{ fontSize: 30 }}  />
            </Avatar>
            <h3 className={classes["heading"]}>Reset Password</h3>
            <form onSubmit={submitHandler} className={classes["auth-form"]} noValidate>
            
                {errors.password && <p className={classes["error-message"]}>{errors.password}</p>}
                {errors.confirmPassword && <p className={classes["error-message"]}>{errors.confirmPassword}</p>}
                <PasswordInputField
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    reference={passwordInput}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                />
                <PasswordInputField
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Comfirm your password"
                    reference={confirmPasswordInput}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                />
                <CustomButton
                    type="submit"
                    label={isSubmitting ? "Resetting Password" : "Reset"}
                    disabled={isSubmitting}
                />
            </form>
        </div>
    );
};

export default Index;
