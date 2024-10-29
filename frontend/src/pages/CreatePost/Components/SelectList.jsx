import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useForumNames from '../Hooks/useForumNames';
import { useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// const theme = {
//     typography: {
//         fontWeightRegular: 400,
//         fontWeightMedium: 500
//     }
// };

// Then use it:
function getStyles(personName, selectedName, theme) {
    return {
        fontWeight: personName.includes(selectedName)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular
    };
}

export default function MultipleSelectPlaceholder() {
    const theme = useTheme();
    const { forums, isLoading, error } = useForumNames();
    const [forumChoice, setForumChoice] = useState('');

    const handleChange = (event) => {
        setForumChoice(event.target.value)
    };

    return (
        <div>
            <FormControl variant='filled' sx={{ m: 1, width: 300, mt: 3 }}>
                <Select
                    displayEmpty
                    value={forumChoice}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                        if (!selected) {
                            return <em>Forum</em>;
                        }
                        return selected
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem disabled value="">
                        <em>Forum</em>
                    </MenuItem>
                    {forums.map((forum) => (
                        <MenuItem
                            key={forum.id}
                            value={forum.name}
                            style={getStyles(forum.name, forumChoice, theme)}
                        >
                            {forum.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}


