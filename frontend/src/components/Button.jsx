import Button from '@mui/material/Button';

const ButtonComponent = ({ type, label, disabled }) => {
  return (
    <Button variant="contained" type={type} disabled={disabled} sx={{ marginTop: '1rem' }}
    >{label}</Button>
  );
};

export default ButtonComponent;