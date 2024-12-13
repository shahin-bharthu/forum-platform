import React from 'react';
import { 
  Box, 
  Card, 
  CardActions, 
  CardContent, 
  Button, 
  Typography, 
  Divider, 
  Link, 
  Stack, 
  Tooltip, 
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  CakeOutlined as CakeOutlinedIcon,
  FaceOutlined as FaceOutlinedIcon,
  GroupsOutlined as GroupsOutlinedIcon,
  Email as EmailIcon,
  NumbersRounded as NumbersRoundedIcon,
  Public as PublicIcon,
  VpnLock as VpnLockIcon
} from '@mui/icons-material';

export default function ForumInfoCard({ forum, creator, postLength, setIsPrivate }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatDate = (dateString) => {
    return new Date(dateString)
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .split('/')
      .join('-');
  };

  return (
    <Card sx={{ 
      mb: 2, 
      width: '100%',
      maxWidth: 600,
      margin: 'auto'
    }}>
      <CardContent>
        <Link href={`/forum/${forum.forum_id}`} color="inherit" underline="hover">
          <Typography
            variant="h6"
            fontWeight="medium"
            component="div"
            sx={{ 
              textAlign: "left", 
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            {forum.name}
          </Typography>
        </Link>

        <Typography
          variant="body2"
          sx={{ 
            color: "text.secondary", 
            mb: 1.5, 
            textAlign: "left",
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          {forum.purpose}
        </Typography>

        <Stack 
          spacing={1} 
          direction="row" 
          alignItems="center" 
          sx={{ my: 2 }}
        >
          <CakeOutlinedIcon 
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem' } 
            }} 
          />
          <Typography 
            variant="body2" 
            fontWeight="medium"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Created {formatDate(forum.createdAt)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1 
          }}
        >
          <Chip
            icon={forum.isPublic ? <PublicIcon /> : <VpnLockIcon />}
            label={forum.isPublic ? 'Public' : 'Private'}
            color={forum.isPublic ? 'primary' : 'secondary'}
            sx={{
              '& .MuiChip-icon': {
                fontSize: { xs: '1rem', sm: '1.25rem' }
              },
              '& .MuiChip-label': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }
            }}
          />
          
          <Tooltip title="Number of posts">
            <Chip 
              icon={<NumbersRoundedIcon />} 
              label={postLength} 
              sx={{
                '& .MuiChip-icon': {
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                },
                '& .MuiChip-label': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }
              }}
            />
          </Tooltip>
          
          <Tooltip title="Number of subscribers">
            <Chip
              icon={<GroupsOutlinedIcon />}
              label={forum.subscriber_count}
              sx={{
                '& .MuiChip-icon': {
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                },
                '& .MuiChip-label': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }
              }}
            />
          </Tooltip>
        </Stack>
      </CardContent>

      <Divider />

      <CardActions>
        <Stack 
          sx={{ 
            mx:1,
            width: '100%', 
            alignItems: 'center' 
          }}
        >
          <Typography
            variant="body1"
            fontWeight="medium"
            sx={{ 
              textAlign: 'left', 
              width: '100%', 
              mb: 1 
            }}
          >
            Admins
          </Typography>

          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1}
            sx={{ width: '100%', mb: 2 }}
          >
            <FaceOutlinedIcon />
            <Typography variant="body2" fontWeight="medium">
              {creator}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (creator)
            </Typography>
          </Stack>

          <Button
            variant="contained"
            startIcon={<EmailIcon />}
            size="small"
            sx={{ minWidth: 150 }}
          >
            Message Admin
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}

// import * as React from "react";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
// import { Divider, Link, Stack, Tooltip } from "@mui/material";
// import LanguageIcon from "@mui/icons-material/Language";
// import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
// import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
// import EmailIcon from "@mui/icons-material/Email";
// import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";
// import PublicIcon from "@mui/icons-material/Public";
// import VpnLockIcon from "@mui/icons-material/VpnLock";
// import Chip from "@mui/material/Chip";

// export default function ForumInfoCard({
//   forum,
//   creator,
//   postLength,
//   setIsPrivate,
// }) {
//   return (
//     <Card sx={{ mb: 2 }}>
//       <CardContent>
//       <Link href={`/forum/${forum.forum_id}`} color="inherit" underline="hover">
//         <Typography
//           variant="h6"
//           fontWeight="fontWeightMedium"
//           component="div"
//           sx={{ textAlign: "left" }}
//         >
//           {forum.name}
//         </Typography>
//         </Link>
//         <Typography
//           fontWeight={450}
//           sx={{ color: "text.secondary", mb: 1.5, textAlign: "left" }}
//         >
//           {forum.purpose}
//         </Typography>
//         <Typography variant="body2" component="div" sx={{ my: 2 }}>
//           <Stack spacing={2} direction="row">
//             <CakeOutlinedIcon />
//             <Box fontWeight="fontWeightMedium" sx={{ alignContent: "end" }}>
//               Created
//             </Box>
//             <Box fontWeight="fontWeightMedium" sx={{ alignContent: "end" }}>
//               {new Date(forum.createdAt)
//                 .toLocaleDateString("en-GB", {
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                 })
//                 .split("/")
//                 .join("-")}
//             </Box>
//           </Stack>
//         </Typography>
//         <Stack
//           spacing={2}
//           direction="row"
//           sx={{ justifyContent: "space-between", mx:1 }}
//         >
//           {forum.isPublic === false ? (
//               <Chip icon={<VpnLockIcon />} label="Private" sx={{pl:1}} />
//           ) : (
//             <Chip icon={<PublicIcon />} label="Public" sx={{pl:1}} />
//           )}
//           {
//             <Tooltip title='Number of posts'>
//               <Chip icon={<NumbersRoundedIcon />} label={postLength} sx={{paddingLeft:1}} />    
//             </Tooltip>
//           }
//           {
//             <Tooltip title='Number of subscribers'>
//             <Chip
//               icon={<GroupsOutlinedIcon />}
//               label={forum.subscriber_count}
//               sx={{pl:1}}
//               />
//             </Tooltip>
//           }
//         </Stack>
//       </CardContent>
//       <Divider />
//       <CardActions sx={{ alignContent: "center" }}>
//         <Stack sx={{ mx: 1, width: "100%" }}>
//           <Typography
//             fontWeight="fontWeightMedium"
//             variant="body1"
//             sx={{ textAlign: "left" }}
//           >
//             Admins
//           </Typography>
//           <Stack spacing={2} direction="row" sx={{ py: 2 }}>
//             <FaceOutlinedIcon />
//             <Box fontWeight="fontWeightMedium" sx={{ alignContent: "end" }}>
//               {creator}
//             </Box>
//             <p>(creator)</p>
//           </Stack>
//           <Box sx={{ textAlign: "center" }}>
//             <Button
//               variant="contained"
//               startIcon={<EmailIcon />}
//               sx={{ mx: "auto" }}
//               size="small"
//             >
//               Message Admin
//             </Button>
//           </Box>
//         </Stack>
//       </CardActions>
//     </Card>
//   );
// }
