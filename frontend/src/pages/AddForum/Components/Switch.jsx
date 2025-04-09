import Switch from '@mui/material/Switch';

export default function ControlledSwitches({clickEvent, isChecked}) {

  return (
    <Switch
      checked={isChecked}
      onClick={clickEvent}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
}