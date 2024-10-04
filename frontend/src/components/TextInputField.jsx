// import classes from './Input.module.css'
import TextField from '@mui/material/TextField';

const TextInputField = ({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  reference,
}) => {
  return (
      <TextField label={label} inputRef={reference}
        type={type}
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required variant="standard" />
  );
};

export default TextInputField;
