import TextField from "@mui/material/TextField";

export default function CustomInput(props) {
  return (
    <>
      <label style={{ fontWeight: "bold" }} htmlFor={props.id || ''}>
        {props.title}
      </label>
      <TextField
        fullWidth
        margin="dense"
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        disabled={props.dis}
        variant="outlined"
        required={props.req}
        type={props.type}
        select={props.select}
      >
        {props.content}
      </TextField>
    </>
  );
}
