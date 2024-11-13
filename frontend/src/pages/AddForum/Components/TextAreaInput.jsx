import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function TextInput({
    label,
    type,
    name,
    value,
    placeholder,
    onChange,
    onFocus,
    reference,
    isDisabled
}) {
  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { mt: 3, width: { xs: '100%', sm: '50ch', md: '50ch', lg: '70ch' } } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField label={label} id={name} defaultValue={value} onChange={onChange} onFocus={onFocus} inputRef={reference} placeholder={placeholder} type={type} multiline rows={4} disabled={isDisabled}/>
      </div>
    </Box>
  );
}
