import Button from '@mui/material/Button';

const ButtonComponent = ({ type, label, disabled, clickHandler, startIcon }) => {
  return (
    <Button variant="contained" startIcon={startIcon} onClick={clickHandler} type={type} disabled={disabled} sx={{ marginTop: '1rem', ":hover": { backgroundColor: theme => theme.palette.primary.light } }}
    >{label}</Button>
  );
};

export default ButtonComponent;