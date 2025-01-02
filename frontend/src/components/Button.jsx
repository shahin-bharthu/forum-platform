import Button from '@mui/material/Button';

const ButtonComponent = ({ type, label, disabled, clickHandler }) => {
  return (
    <Button variant="contained" onClick={clickHandler} type={type} disabled={disabled} sx={{ marginTop: '1rem' }}
    >{label}</Button>
  );
};

export default ButtonComponent;