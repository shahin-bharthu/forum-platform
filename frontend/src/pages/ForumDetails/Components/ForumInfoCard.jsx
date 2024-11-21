import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined'; import { Divider, Stack } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import EmailIcon from '@mui/icons-material/Email';
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded';

export default function ForumInfoCard({ forum, creator,postLength }) {
    return (
        <Card sx={{mb:2}}>
            <CardContent>
                <Typography variant="h5"fontWeight='fontWeightMedium' component="div" sx={{ textAlign: "left" }}>
                    {forum.name}
                </Typography>
                <Typography fontWeight='fontWeightMedium' sx={{ color: 'text.secondary', mb: 1.5,textAlign: "left" }}>{forum.purpose}</Typography>
                <Typography variant="body2" component="div" sx={{ my: 2 }}>
                    <Stack spacing={2} direction="row">
                        <CakeOutlinedIcon />
                        <Box fontWeight='fontWeightMedium' sx={{ alignContent: 'end' }}>
                            created
                        </Box>
                        <Box fontWeight='fontWeightMedium' sx={{ alignContent: 'end' }}>
                            {new Date(forum.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            }).split('/').join('-')}
                        </Box>
                    </Stack>
                </Typography>
                <Stack spacing={2} direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2" component="div">
                        <Stack spacing={2} direction="row">
                            <LanguageIcon />
                            <Box fontWeight='fontWeightMedium' sx={{ alignContent: 'end' }}>
                                {forum.isPublic === false ? 'Private' : 'Public'}
                            </Box>
                        </Stack>
                    </Typography>
                    <Typography variant="body2" component="div">
                        <Stack spacing={2} direction="row">
                            <NumbersRoundedIcon fontSize='medium' />
                            <Box fontWeight='fontWeightMedium' sx={{ alignContent: 'end' }}>
                                {postLength}
                            </Box>
                        </Stack>
                    </Typography>
                    <Typography variant="body2" component="div">
                        <Stack spacing={2} direction="row">
                            <GroupsOutlinedIcon fontSize='medium' />
                            <Box fontWeight='fontWeightMedium' sx={{ alignContent: 'end' }}>
                                {forum.subscriber_count}
                            </Box>
                        </Stack>
                    </Typography>
                </Stack>
            </CardContent>
            <Divider />
            <CardActions sx={{ alignContent: 'center' }}>
                <Stack sx={{ mx: 1, width: '100%' }} >
                    <Typography fontWeight='fontWeightMedium' variant="body1" sx={{ textAlign: "left" }}>
                        Admins
                    </Typography>
                    <Stack spacing={2} direction="row" sx={{ py: 2 }}>
                        <FaceOutlinedIcon />
                        <Box fontWeight='fontWeightMedium' sx={{ alignContent: 'end' }}>
                            {creator}
                        </Box>
                        <p>(creator)</p>
                    </Stack>
                    <Box sx={{ textAlign: "center" }}><Button variant='contained' startIcon={<EmailIcon />} sx={{ mx: "auto" }} size="small">Message Admin</Button></Box>
                </Stack>
            </CardActions>
        </Card >
    );
}