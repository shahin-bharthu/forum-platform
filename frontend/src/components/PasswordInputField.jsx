import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Input from '@mui/material/Input';
import Visibility from "@mui/icons-material/Visibility";
import InputLabel from '@mui/material/InputLabel';
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from '@mui/material/FormControl';
import { useState } from "react";
const PasswordInputField = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  reference,
}) => {
    
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
    <FormControl sx={{ m: 0 }} variant="standard">
    <InputLabel htmlFor="standard-adornment-password">{label} *</InputLabel>
    <Input
      type={showPassword ? "text" : "password"}
      ref={reference}
      name={name}
      id={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            onMouseUp={handleMouseUpPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      label={label}
      required 
    />
    </FormControl>
    </>
  );
};

export default PasswordInputField;
