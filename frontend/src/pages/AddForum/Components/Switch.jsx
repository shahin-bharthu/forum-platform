import * as React from 'react';
import Switch from '@mui/material/Switch';

export default function ControlledSwitches({onChange, label}) {
  const [checked, setChecked] = React.useState(true);

//   const handleChange = (event) => {
//     setChecked(event.target.checked);
//   };

  return (
    <Switch
      checked={checked}
      label={label}
      onChange={onChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
}