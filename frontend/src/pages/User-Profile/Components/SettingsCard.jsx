import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { Divider } from "@mui/material";

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
  const [updateMessage, setUpdateMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUser({
      id: props.id,
      firstname: props.firstname,
      lastname: props.lastname,
      dob: props.dob ? new Date(props.dob) : null, // Ensure DOB is set as a Date object
      gender: props.gender,
      email: props.email,
      country: props.country || "",
    });
  }, [props]);

  const changeField = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
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

      const response = await axios.put(
        "http://localhost:8080/user/update",
        formattedUser,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );

      setUpdateMessage(response.data.message);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Card variant="outlined" sx={{ height: "100%", width: "100%" }}>
      <br />
      {updateMessage && (
        <>
          <p style={{ color: "#1e88e5" }}>{updateMessage}</p>
          <Divider />
        </>
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
                  content={countries.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
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
          <Button onClick={handleDialogClose} color="primary">
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
