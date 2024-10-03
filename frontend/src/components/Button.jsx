// import classes from './Button.module.css'
import Button from '@mui/material/Button';

const ButtonComponent = ({ type, label, disabled }) => {
    return (
      <Button variant="contained"  type={type} disabled={disabled}>{label}</Button>
    );
};

export default ButtonComponent;