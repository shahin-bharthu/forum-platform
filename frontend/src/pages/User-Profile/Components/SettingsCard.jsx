import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import CustomInput from "./CustomInput";
import DatePicker from "./DatePicker.jsx";
import useCountries from "../Hooks/useCountries.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import PositionedSnackbar from "../../../components/SnackBar.jsx";
import { z } from "zod";
import { CircularProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {clearNotification, setNotification} from "../../../store/uiSlice.js"

export default function SettingsCard(props) {
  const genderSelect = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "pnts", label: "Prefer not to say" },
  ];

  const [user, setUser] = useState({
    id: "",
    firstname: "firstname",
    lastname: "lastname",
    dob: "dob",
    gender: "male",
    email: "abc@gmail.com",
    country: "",
  });

  const { countries, isLoading, error } = useCountries();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [edit, setEdit] = useState(true);
  const [errors, setErrors] = useState({});
  const notification = useSelector(state=>state.ui.notification);// to show toast

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    setUser({
      id: props.id,
      firstname: props.firstname || '',
      lastname: props.lastname || '',
      dob: props.dob ? new Date(props.dob) : null, // Ensure DOB is set as a Date object
      gender: props.gender,
      email: props.email,
      country: props.country || "",
    });
  }, [props]);

  const userInfoSchema = z.object({
    firstname: z
      .string()
      .min(1, "Field cannot be empty")
      .max(50, "Cannot exceed 50 Characters")
      .regex(/^[A-Za-z]+$/, "Should contain only alphabets"),
    lastname: z
      .string()
      .min(1, "Field cannot be empty")
      .max(50, "Cannot exceed 50 Characters")
      .regex(/^[A-Z a-z]+$/, "Should contain only alphabets"),
    dob: z
      .string()
      .refine((date) => {
        const inputDate = new Date(date)
        const today = new Date()
        const minAge = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        )

        return inputDate <= minAge
      }
        , { message: "You must be above 18 years of age" }),
    gender: z
      .enum(["male", "female", "other", "pnts"], "Gender must be from the selected list"),
    email: z
      .string()
      .email("Invlaid email address"),
    country: z
      .string()
      .refine((val) => countries.some(country => country.value === val), {
        message: "Invalid selection"
      })
  });

  const validateForm = (formData) => {

    const trimmedFormData = {
      ...formData,
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim()
    };

    try {
      userInfoSchema.parse(trimmedFormData);
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

  const changeField = (event) => {
    const { name, value } = event.target;

    // Trim firstname and lastname
    const processedValue =
      name === 'firstname' || name === 'lastname'
        ? value.trim()
        : value;

    setUser({
      ...user,
      [name]: processedValue
    });
  };

  const handleUpdateClick = (event) => {
    event.preventDefault();
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmUpdate = async () => {
    try {
      const formattedUser = {
        ...user,
        dob: dayjs(user.dob).format("YYYY-MM-DD"), // Format DOB as 'YYYY-MM-DD'
      };

      if (!validateForm(formattedUser)) {
        console.log("validation error");
        handleDialogClose()
        return;
      }

      const response = await axiosInstance.put('/user/update', formattedUser);

      dispatch(setNotification({message:response.data.message, type:null}))
      setTimeout(() => {
        dispatch(clearNotification())
        navigate("/user/profile");
      }, 1500);

      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Card variant="outlined" sx={{ height: "100%", width: "100%" }}>
      <br />

      {notification.message && (
        <PositionedSnackbar message={notification.message} type={notification.type} />
      )}

      {/* MAIN CONTENT CONTAINER */}
      <form>
        <CardContent
          sx={{
            p: 3,
            maxHeight: { md: "40vh" },
            textAlign: { xs: "center", md: "start" },
          }}
        >
          {/* FIELDS */}
          <FormControl fullWidth>
            <Grid
              container
              direction={{ xs: "column", md: "row" }}
              columnSpacing={5}
              rowSpacing={3}
            >
              {/* ROW 1: FIRST NAME */}
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInput
                  id="firstname"
                  name="firstname"
                  value={user.firstname}
                  onChange={changeField}
                  title="First Name"
                  dis={!edit}
                  req={true}
                  help={errors.firstname}
                  error={errors.firstname ? true : false}
                />
              </Grid>

              {/* ROW 1: LAST NAME */}
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInput
                  id="lastname"
                  name="lastname"
                  value={user.lastname}
                  onChange={changeField}
                  title="Last Name"
                  dis={!edit}
                  req={true}
                  help={errors.lastname}
                  error={errors.lastname ? true : false}
                />
              </Grid>

              {/* ROW 2: DoB */}
              <Grid size={{ xs: 12, md: 6 }}>
                <DatePicker
                  value={user.dob}
                  onChange={(newValue) => {
                    console.log("Selected DOB:", newValue);
                    setUser({ ...user, dob: newValue });
                  }}
                  dis={!edit}
                  help={errors.dob}
                  error={errors.dob ? true : false}
                />
              </Grid>

              {/* ROW 2: GENDER */}
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInput
                  select
                  id="gender"
                  name="gender"
                  value={user.gender}
                  onChange={changeField}
                  title="Gender"
                  dis={!edit}
                  req={true}
                  content={genderSelect.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                  help={errors.gender}
                />
              </Grid>

              {/* ROW 3: EMAIL */}
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInput
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={changeField}
                  title="Email Address"
                  dis={true} // Email is not editable
                  req={true}
                  help={errors.email}
                />
              </Grid>

              {/* ROW 3: Country */}
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomInput
                  select
                  id="country"
                  name="country"
                  value={user.country}
                  onChange={changeField}
                  title="Country"
                  dis={!edit}
                  req={true}
                  content = {
                    isLoading ? (
                      <CircularProgress size="30px" sx={{ mx: 11 }} />
                    ) : error ? (
                      <Typography sx={{ mx: 11, color: 'red' }}>An error occurred. Please try again.</Typography>
                    ) : (
                      countries.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))
                    )
                }
                  help={errors.country}
                />
              </Grid>

              {/* ROW 4: BUTTON */}
              <Grid
                container
                justifyContent={{ xs: "center", md: "flex-end" }}
                size={{ xs: 12 }}
              >
                <Button
                  sx={{ p: "1rem 2rem", my: 2, height: "2.5rem" }}
                  component="button"
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateClick}
                >
                  UPDATE
                </Button>
              </Grid>
            </Grid>
          </FormControl>
        </CardContent>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update your details?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
