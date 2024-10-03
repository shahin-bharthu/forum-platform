import { Link } from "react-router-dom";
import classes from "./AuthForm.module.css";

const AuthFormFooter = ({ authPara,authLink,authLabelLink }) => {
    return (
      <>
        <p>{authPara}<Link className={classes["constant-color-link"]} to={authLink}>{authLabelLink}</Link></p>
      </>
    );
  };
  
  export default AuthFormFooter;
  