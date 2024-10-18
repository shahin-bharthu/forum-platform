import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import Grid from "@mui/material/Grid2";
import ProfileCard from "./Components/ProfileCard";
import SettingsCard from "./Components/SettingsCard";

export default function Index() {
  const [text, setText] = useState("");
  const [user, setUser] = useState({
    firstname: ' ',
    lastname: ' ',
    dob: new Date(Date.now()),
    country: 'IN',
    gender: 'male',
    email: ' ',
    username: ' ',
    dt1: 0,
    dt2: 0,
    dt3: 0,
  });


  useEffect(() => {
    const fetchData = async () => { 
      console.log("first useEffect");
      
      const token = getCookie('token');
      
      if (token) {
        try {
          const decoded = jwtDecode(token);
          await fetchUserDetails(decoded.id); 
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
      }
    };

    fetchData(); 
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/${userId}`); 
      const data = response.data.user;
      setUser({
        id: data.id,
        firstname: data.firstname,
        lastname: data.lastname,
        dob: data.dob || '',
        country: data.country,
        gender: data.gender || 'male',
        email: data.email,
        username: data.username,
        dt1: 10,
        dt2: 20,
        dt3: 30,
      });
      
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    console.log("second useeffect");
    
    console.log("USER: ", user);
  }, [user]);
  
  const fullName = `${user.firstname} ${user.lastname}`;

  return (
    <Grid container direction="column">
      <Grid size={{xs:12, md:12}}>
        <img
          alt="avatar"
          style={{
            width: "100%",
            height: "40vh",
            objectFit: "cover",
            objectPosition: "50% 50%",
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
            name={fullName !== 'null null' ? fullName:'anonymous'}
            sub={user.username}
            dt1={user.dt1}
            dt2={user.dt2}
            dt3={user.dt3}
          ></ProfileCard>
        </Grid>

        {/* SETTINGS CARD */}
        <Grid size={{xs:12,md:8, lg:9}}>
          <SettingsCard
            expose={(v) => setText(v)}
            id={user.id}
            firstname={user.firstname}
            lastname={user.lastname}
            email={user.email}
            country={user.country}
            gender={user.gender}
            dob={new Date(user.dob)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}