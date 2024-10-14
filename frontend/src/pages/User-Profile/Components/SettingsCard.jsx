// IMPORTS
import React, { useState } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import CardContent from "@mui/material/CardContent";
import Grid from '@mui/material/Grid2';
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomInput from "./CustomInput";
import DatePicker from "./DatePicker.jsx"
import useCountries from "../Hooks/useCountries.js";
//APP
export default function SettingsCard(props) {
  //TAB STATES
  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // GENDER SELECT STATES
  const genderSelect = [
    {
      value: "male",
      label: "Male"
    },
    {
      value: "female",
      label: "Female"
    },
    {
      value: "other",
      label: "Other"
    },
    {
      value: "prefer not to say",
      label: "Prefer not to say"
    }
  ];

  const { countries, isLoading, error } = useCountries();

  // FORM STATES
  const [user, setUser] = useState({
    // DEFAULT VALUES
    firstname: props.firstname,
    lastname: props.lastname,
    dob: props.dob,
    gender: props.gender,
    email: props.email,
    country: props.country || "",
  });

  const changeField = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  //BUTTON STATES
  const [edit, update] = useState({
    required: true,
    disabled: true,
    isEdit: true
  });

  // EDIT -> UPDATE
  const changeButton = (event) => {
    event.preventDefault();
    
    user.showPassword = false;
    edit.disabled = !edit.disabled;
    edit.isEdit = !edit.isEdit;
    update({ ...edit });

    if(edit.isEdit) {
      const formData = {firstname: user.firstname, lastname: user.lastname, dob: user.dob, gender: user.gender, country: user.country};
      console.log("user: ", formData);
    }
  };

  //RETURN
  return (
    <Card variant="outlined" sx={{ height: "100%", width: "100%" }}>
      {/* TABS */}
      <br></br>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab value="one" label="Account" />
      </Tabs>
      <Divider></Divider>

      {/* MAIN CONTENT CONTAINER */}
      <form>
        <CardContent
          sx={{
            p: 3,
            maxHeight: { md: "40vh" },
            textAlign: { xs: "center", md: "start" }
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
              <Grid  size={{xs:12, md:6}}>
                <CustomInput
                  id="firstname"
                  name="firstname"
                  value={user.firstname}
                  onChange={changeField}
                  title="First Name"
                  dis={edit.disabled}
                  req={edit.required}
                ></CustomInput>
              </Grid>

              {/* ROW 1: LAST NAME */}
              <Grid  size={{xs:12, md:6}}>
                <CustomInput
                  id="lastname"
                  name="lastname"
                  value={user.lastname}
                  onChange={changeField}
                  title="Last Name"
                  dis={edit.disabled}
                  req={edit.required}
                ></CustomInput>
              </Grid>

              {/* ROW 2: DoB */}
              <Grid size={{xs:12, md:6}}>
                <DatePicker/>
              </Grid>

              {/* ROW 2: GENDER */}
              <Grid size={{xs:12, md:6}}>
                <CustomInput
                  select
                  id="gender"
                  name="gender"
                  value={user.gender}
                  onChange={changeField}
                  title="Gender"
                  dis={edit.disabled}
                  req={edit.required}
                  content={genderSelect.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                ></CustomInput>
              </Grid>

              {/* ROW 3: EMAIL */}
              <Grid size={{xs:12, md:6}}>
                <CustomInput
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={changeField}
                  title="Email Address"
                  dis={edit.disabled}
                  req={edit.required}
                ></CustomInput>
              </Grid>
              
              {/* ROW 3: Country */}
              <Grid size={{xs:12, md:6}}>
                  <CustomInput
                  select
                  id="country"
                  name="country"
                  value={user.country}
                  onChange={changeField}
                  title="Country"
                  dis={edit.disabled}
                  req={edit.required}
                  content={countries.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                />
                
              </Grid>

              {/*  ROW 4: BUTTON */}
              <Grid
                container
                justifyContent={{ xs: "center", md: "flex-end" }}
                size={{xs:12}}
              >
                <Button
                  sx={{ p: "1rem 2rem", my: 2, height: "3rem" }}
                  component="button"
                  variant="contained"
                  color="primary"
                  onClick={changeButton}
                >
                  {edit.isEdit === false ? "UPDATE" : "EDIT"}
                </Button>
              </Grid>
            </Grid>
          </FormControl>
        </CardContent>
      </form>
    </Card>
  );
}
