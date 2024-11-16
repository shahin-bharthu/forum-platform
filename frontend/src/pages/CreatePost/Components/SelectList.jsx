// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import CircularProgress from "@mui/material/CircularProgress";
// import { useState } from "react";
// import useForumNames from "../Hooks/useForumNames";

// export default function Asynchronous({ getForum }) {
//   const { forums, isLoading, error } = useForumNames();
//   const [open, setOpen] = useState(false);
//   const [options, setOptions] = useState([]);
//   const [selectedForum, setSelectedForum] = useState(null);

//   const handleOpen = () => {
//     setOpen(true);
//     setOptions([...forums]);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setOptions([]);
//   };

//   const triggerCallback = (event) => {
//     event.preventDefault();
//     // setSelectedForum(event.target.value)
//     // if (selectedForum) {
//       getForum(event.target.value);
//     // }
//     console.log(event.target.value);
//   };

//   return (
//     <form>
//       <Autocomplete
//         sx={{
//           mt: 2,
//           width: "40%",
//           "& .MuiOutlinedInput-root": {
//             borderRadius: "28px",
//           },
//           "& .MuiAutocomplete-paper": {
//             borderRadius: "15px",
//           },
//         }}
//         open={open}
//         onOpen={handleOpen}
//         onClose={handleClose}
//         isOptionEqualToValue={(option, value) => option.name === value.name}
//         getOptionLabel={(option) => option.name}
//         options={options}
//         loading={isLoading}
//         // onChange={triggerCallback}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Forum"
//             onChange={triggerCallback}
//             placeholder="Select a Forum"
//             slotProps={{
//               input: {
//                 ...params.InputProps,
//                 endAdornment: (
//                   <>
//                     {isLoading ? (
//                       <CircularProgress color="inherit" size={20} />
//                     ) : null}
//                     {params.InputProps.endAdornment}
//                   </>
//                 ),
//               },
//             }}
//           />
//         )}
//       />
//     </form>
//   );
// }

// onChange={(event, newValue) => {
//     setSelectedForum(newValue);  // Update selectedForum state when a forum is selected
// }}



import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useForumNames from "../Hooks/useForumNames";

export default function SelectList({ getForum }) {
  const { forums, error } = useForumNames();
  const [forum, setForum] = useState('');

  const handleChange = (event) => {
    console.log(event.target.value);
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
        <InputLabel id="demo-simple-select-label" required>Forum</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={forum}
          label="Select Forum"
          onChange={handleChange}
        >
          {forums.map((val) =>
            <MenuItem value={val.id}>{val.name}</MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
}