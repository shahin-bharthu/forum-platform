import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerValue({ value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <label style={{ fontWeight: "bold" }}>Date of Birth *</label>
      <br />
      <DatePicker
      sx={{mt:1, mb:0.5, width:'100%'}}
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
