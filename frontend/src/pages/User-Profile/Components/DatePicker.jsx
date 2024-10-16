import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerValue({ value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <label style={{ fontWeight: "bold" }}>Date of Birth *</label>
      <DatePicker
        fullWidth
        margin="dense"
        value={dayjs(value)} 
        onChange={(newValue) => onChange(newValue?.toDate())} 
        variant='standard'
        required
      />
    </LocalizationProvider>
  );
}
