import {  
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
  useTheme,
  tooltipClasses
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
          <Tooltip
            title={forum.name}
            placement="top-start"
            slotProps={{
              popper: {
                sx: {
                  [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                  {
                    marginBottom: '0px',
                  },
                },
              },
            }}
            arrow
          >
            <Typography
              variant="h6"
              fontWeight="medium"
              component="div"
              sx={{
                textAlign: "left",
                mb: 1,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: "90%"
              }}
            >
              {forum.name}
            </Typography>
          </Tooltip>
        </Link>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 1.5,
            textAlign: "left",
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            wordBreak: "break-word"
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
            justifyContent: postLength ? 'space-between' : 'flex-start',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: postLength ? 1 : 3
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

          {postLength>=0 && <Tooltip title="Number of posts">
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
          </Tooltip>}

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
            mx: 1,
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