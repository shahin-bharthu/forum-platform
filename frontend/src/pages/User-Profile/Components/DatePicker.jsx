import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerValue() {
    const [value, setValue] = React.useState(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <label style={{ fontWeight: "bold" }} > Date of Birth *</label>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker
          fullWidth
          margin="dense"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          variant='standard'
          required
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
