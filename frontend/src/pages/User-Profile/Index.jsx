import { useState } from "react";
import Grid from "@mui/material/Grid2";
import ProfileCard from "./Components/ProfileCard";
import SettingsCard from "./Components/SettingsCard";

export default function Index() {
  const [text, setText] = useState("");

  const mainUser = {
    // DEFAULT VALUES
    username:'janedoe123',
    dt1: 32,
    dt2: 40,
    dt3: 50,
    firstname: 'Jane',
    lastname: "Doe",
    dob: '12/23/2024',
    gender: "female",
    email: "janedoe@gmail.com",
    country:''
  };

  const fullName = `${mainUser.firstname.text} ${mainUser.lastname}`;

  return (
    <Grid container direction="column">
      <Grid size={{xs:12, md:12}}>
        <img
          alt="avatar"
          style={{
            width: "100%",
            height: "35vh",
            objectFit: "cover",
            objectPosition: "50% 50%",
            // position: "relative",
          }}
          src="https://iconerecife.com.br/wp-content/plugins/uix-page-builder/uixpb_templates/images/UixPageBuilderTmpl/default-cover-6.jpg"
        />
      </Grid>

      {/* COMPONENTS */}
      <Grid
        container
        direction={{ xs: "column", md: "row" }}
        spacing={3} sx={{ mt: -15, px: { xs: 2, md: 7 } }}
      >
        {/* PROFILE CARD */}
        <Grid size={{xs:12, md:4, lg:3}}>
          <ProfileCard
            name={fullName}
            sub={mainUser.username}
            dt1={mainUser.dt1}
            dt2={mainUser.dt2}
            dt3={mainUser.dt3}
          ></ProfileCard>
        </Grid>

        {/* SETTINGS CARD */}
        <Grid size={{xs:12,md:8, lg:9}}>
          <SettingsCard
            expose={(v) => setText(v)}
            firstname={mainUser.firstname}
            lastname={mainUser.lastname}
            midName={mainUser.midName}
            phone={mainUser.phone}
            email={mainUser.email}
            country={mainUser.country}
            gender={mainUser.gender}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
