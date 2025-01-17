import { Box, Card, CardActions, CardContent, CardHeader, Skeleton, styled } from "@mui/material";
import { memo } from "react";

const StyledCardHeader = memo(styled(CardHeader)(({ theme }) => ({
    '.MuiCardHeader-content': {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(3),
    },
    '.MuiCardHeader-title': {
        margin: 0,
    },
    '.MuiCardHeader-subheader': {
        margin: 0,
    }
})));
export default function TopicSkeleton() {
    return(
        <Box mb={2}>
            <Card>
                <StyledCardHeader
                    avatar={<Skeleton variant="circular" width={40} height={40} animation="wave" />}
                    title={<Skeleton variant="text" width="100%" sx={{mr:9}} animation="wave" />}
                    subheader={<Skeleton variant="text" width="100%" sx={{mr:5}} animation="wave" />}
                />
                <CardContent>
                    <Skeleton variant="text" width="80%" animation="wave"/>
                    <Skeleton variant="text" width="60%" animation="wave"/>
                </CardContent>
                <CardActions>
                    <Skeleton variant="circular" width={40} height={40} sx={{ml: 1}} animation="wave"/>
                    <Skeleton variant="circular" width={40} height={40} animation="wave"/>
                </CardActions>
            </Card>
        </Box>
    );
}
