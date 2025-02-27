import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import highlightText from '../../../../utils/highlightText.jsx';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';

const ResultsList = ({results, searchText, avatarSrc, avatarAlt, tooltipTitle, route, navLink, primaryText, secondaryText }) => {
    const navigate = useNavigate();

    return (
        <List sx={{width: '100%'}}>
            {results.map((result) => {
                return (
                <>
                    <ListItem alignItems="flex-start" sx={{bgcolor: 'background.paper', borderRadius: 5}}>
                        <Tooltip title={result[tooltipTitle]}>
                            <ListItemAvatar>
                                <Avatar alt={result[avatarAlt]} src={result[avatarSrc]} />
                            </ListItemAvatar>
                        </Tooltip>
                        <ListItemText
                            sx={{cursor: 'pointer', wordBreak: 'break-word'}}
                            onClick={() => navigate(route+"/"+result[navLink])}
                            primary={highlightText(result[primaryText], searchText)}
                            secondary={highlightText(result[secondaryText], searchText)}
                        />
                    </ListItem>
                    <Divider variant="middle" component="li" sx={{my: 0.5}} />
                </>
                )
            })} 
        </List>
    )
}

export default ResultsList