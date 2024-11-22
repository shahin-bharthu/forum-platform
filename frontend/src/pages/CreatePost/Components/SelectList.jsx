import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useForumNames from "../Hooks/useForumNames";
import { TextField } from '@mui/material';

export default function SelectList({ selectedForumName, getForum }) {
  const { forums, error } = useForumNames();
  const [forum, setForum] = useState('');

  const handleChange = (event) => {
    // console.log("",event.target.value);
    setForum(event.target.value);
    getForum(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl
        sx={{
          mt: 2,
          width: "40%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "28px",
          },
          "& .MuiAutocomplete-paper": {
            borderRadius: "15px",
          },
        }}>
        {selectedForumName ? 
          <TextField id="outlined-basic" defaultValue={selectedForumName} value={selectedForumName} disabled label="Forum" variant="outlined"/>
          :
          <>
          <InputLabel id="demo-simple-select-label" required>Forum</InputLabel>
          <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={ forum }
          label="Select Forum"
          onChange={handleChange}
          >
          {forums.map((val) => <MenuItem value={val.id}>{val.name}</MenuItem>)}
          </Select>
          </>
        }
      </FormControl>
    </Box>
  );
}