import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { blue } from "@mui/material/colors";

const AuthFormHeader = ({ authHeading, authPara }) => {
  return (
    <>
      <Avatar sx={{ bgcolor: theme => theme.palette.primary.main}}>
        <LockOutlinedIcon data-testid="LockOutlinedIcon" />
      </Avatar>
      <h3>{authHeading}</h3>
      <p>Welcome, please {authPara} to continue</p>
    </>
  );
};

export default AuthFormHeader;
