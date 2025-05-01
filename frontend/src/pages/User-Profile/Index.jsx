import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Grid from "@mui/material/Grid2";
import ProfileCard from "./Components/ProfileCard";
import SettingsCard from "./Components/SettingsCard";
import axiosInstance from "../../../utils/axiosInstance.js";
import { formatDate } from "../../../utils/timestamp.js";
import { useSelector } from "react-redux";
import AnimatedLayout from "../../components/AnimatedLayout.jsx";
export default function Index() {
  const [change, setChange] = useState(0);
  const [text, setText] = useState("");
  const { userPostCount } = useSelector(state => state.userPosts.userPostCount);
  const [user, setUser] = useState({
    firstname: ' ',
    lastname: ' ',
    dob: new Date(Date.now()),
    country: '',
    gender: 'male',
    email: ' ',
    username: ' ',
    dt1: 0,
    dt2: 0,
    dt3: 0,
  });


  useEffect(() => {
    const fetchData = async () => {       
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
  }, [change]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axiosInstance.get(`/user/${userId}`); 
      
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
        dt1: userPostCount || 0,
        dt2: formatDate(data.createdAt),
        dt3: 30,
      });

    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };
  
  const fullName = `${user.firstname} ${user.lastname}`;

  return (
    <AnimatedLayout container direction="column" sx={{alignSelf: 'start', mt:7}}>
      <Grid size={{xs:12, md:12}}>
        <img
          alt="avatar"
          style={{
            width: "100%",
            height: "35vh",
            objectFit: "cover",
            objectPosition: "50% 50%",
          }}
          src="https://cdn.pixabay.com/photo/2016/10/29/02/20/yellow-1779696_1280.jpg"
        />
      </Grid>

      {/* COMPONENTS */}
      <Grid
        container
        direction={{ xs: "column", md: "row" }}
        spacing={3} sx={{ mt: -16, px: { xs: 2, md: 7 } }}
      >
        {/* PROFILE CARD */}
        <Grid size={{xs:12, md:4, lg:3}}>
          <ProfileCard
            name={fullName !== 'null null' ? fullName:'anonymous'}
            sub={user.username}
            id={user.id}
            email={user.email}
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
            setChange={setChange}
          />
        </Grid>
      </Grid>
    </AnimatedLayout>
  );
}