import { Avatar, ListItem, ListItemAvatar, ListItemText, styled, Typography } from "@mui/material"
import { memo } from "react";

const StyledListItem = memo(styled(ListItem)(({ theme }) => ({
    '.MuiListItemAvatar-root': {
      display: 'block',
      textAlign: 'center',
      marginTop: theme.spacing(1),
    },
    '.MuiListItemText-root': {
      display: 'block',
      textAlign: 'center',
      margin: 0,
    },
    display: 'block',
    textAlign: 'center',
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: theme.spacing(2), 
  })));

export default function NoResultFound({searchText}) {
    return (
        <StyledListItem>
            <ListItemAvatar
                sx={{mb:2}}
            >
              <Avatar alt="no results found" src="/no-results.gif" 
                sx={{ 
                  width: 150, 
                  height: 'auto', 
                  margin: '0 auto', 
                  borderRadius: '0%',
                }} 
              />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="h4" >No results found for "{searchText}"</Typography>}
              secondary={<Typography variant="subtitle1" color="text.secondary" >Double-check your spelling or try different keywords</Typography>}
            />
          </StyledListItem> 
    )
}