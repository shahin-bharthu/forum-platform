import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import useForumNames from '../Hooks/useForumNames';

export default function Asynchronous() {
    const { forums, isLoading, error } = useForumNames();
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);

    const handleOpen = () => {
        setOpen(true);
        setOptions([...forums]);
    };

    const handleClose = () => {
        setOpen(false);
        setOptions([]);
    };

    return (
        <Autocomplete
            sx={{
                mt:2, width: '40%', 
                '& .MuiOutlinedInput-root': {
                    borderRadius: '28px',
                },
                '& .MuiAutocomplete-paper': {
                    borderRadius: '15px',
                }
            }}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={isLoading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Forum"
                    placeholder='Select a Forum'
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        },
                    }}
                />
            )}
        />
    );
}



// import { useTheme } from '@mui/material/styles';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import { useCallback, useState } from 'react';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// };

// // Then use it:
// function getStyles(forum, selectedName, theme) {
//     return {
//         fontWeight: forum.includes(selectedName)
//             ? theme.typography.fontWeightMedium
//             : theme.typography.fontWeightRegular
//     };
// }

// export default function MultipleSelectPlaceholder() {
//     const theme = useTheme();
//     const { forums, isLoading, error } = useForumNames();
//     const [forumChoice, setForumChoice] = useState('');

//     const handleChange = useCallback((event) => {
//         setForumChoice(event.target.value);
//     }, []);

//     const renderValue= useCallback((selected) => {
//         if (!selected) {
//             return <em>Forum</em>;
//         }
//         return selected
//     },[])

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }


//     return (
//         <div>
//             <FormControl variant='filled' sx={{ m: 1,  width: { xs: '100%', sm: '50ch', md: '50ch', lg: '70ch' }, mt: 3 }}>
//                 <Select
//                     displayEmpty
//                     value={forumChoice}
//                     onChange={handleChange}
//                     input={<OutlinedInput />}
//                     renderValue={renderValue}
//                     MenuProps={MenuProps}
//                 >
//                     <MenuItem disabled value="">
//                         <em>Forum</em>
//                     </MenuItem>
//                     {forums.map((forum) => (
//                         <MenuItem
//                             key={forum.id}
//                             value={forum.name}
//                             style={getStyles(forum.name, forumChoice, theme)}
//                         >
//                             {forum.name}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>
//         </div>
//     );
// }
