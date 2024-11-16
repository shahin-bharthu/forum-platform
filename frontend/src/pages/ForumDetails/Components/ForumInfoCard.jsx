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

export default function ForumInfoCard({ forum, creator }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" bold component="div" sx={{ justifyContent: 'left' }}>
                    {forum.name}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{forum.purpose}</Typography>
                <br/>
                <Typography variant="body2">
                    <Stack spacing={2} direction="row">
                        <FaceOutlinedIcon />
                        <Box fontWeight='fontWeightMedium' sx={{ alignContent: 'end' }}>
                            {creator}
                        </Box>
                    </Stack>
                    <br/>
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
                <br/>
                <Stack spacing={2} direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                        <Stack spacing={2} direction="row">
                            <LanguageIcon />
                            <Box fontWeight='fontWeightMedium' sx={{ alignContent: 'end' }}>
                                {forum.isPublic === 0 ? 'Private' : 'Public'}
                            </Box>
                        </Stack>
                    </Typography>
                    <Typography variant="body2">
                        <Stack spacing={2} direction="row">
                            <GroupsOutlinedIcon fontSize='medium' />
                            <Box fontWeight='fontWeightMedium' sx={{ alignContent: 'end' }}>
                                {forum.subscriber_count}
                            </Box>
                        </Stack>
                    </Typography>
                </Stack>
            </CardContent>
            <Divider/>
            <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
        </Card >
    );
}
