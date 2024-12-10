import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import { Divider, Stack, Tooltip } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EmailIcon from "@mui/icons-material/Email";
import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";
import PublicIcon from "@mui/icons-material/Public";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import Chip from "@mui/material/Chip";

export default function ForumInfoCard({
  forum,
  creator,
  postLength,
  setIsPrivate,
}) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="fontWeightMedium"
          component="div"
          sx={{ textAlign: "left" }}
        >
          {forum.name}
        </Typography>
        <Typography
          fontWeight={450}
          sx={{ color: "text.secondary", mb: 1.5, textAlign: "left" }}
        >
          {forum.purpose}
        </Typography>
        <Typography variant="body2" component="div" sx={{ my: 2 }}>
          <Stack spacing={2} direction="row">
            <CakeOutlinedIcon />
            <Box fontWeight="fontWeightMedium" sx={{ alignContent: "end" }}>
              Created
            </Box>
            <Box fontWeight="fontWeightMedium" sx={{ alignContent: "end" }}>
              {new Date(forum.createdAt)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .split("/")
                .join("-")}
            </Box>
          </Stack>
        </Typography>
        <Stack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "space-between", mx:1 }}
        >
          {forum.isPublic === false ? (
              <Chip icon={<VpnLockIcon />} label="Private" sx={{pl:1}} />
          ) : (
            <Chip icon={<PublicIcon />} label="Public" sx={{pl:1}} />
          )}
          {
            <Tooltip title='Number of posts'>
              <Chip icon={<NumbersRoundedIcon />} label={postLength} sx={{paddingLeft:1}} />    
            </Tooltip>
          }
          {
            <Tooltip title='Number of subscribers'>
            <Chip
              icon={<GroupsOutlinedIcon />}
              label={forum.subscriber_count}
              sx={{pl:1}}
              />
            </Tooltip>
          }
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ alignContent: "center" }}>
        <Stack sx={{ mx: 1, width: "100%" }}>
          <Typography
            fontWeight="fontWeightMedium"
            variant="body1"
            sx={{ textAlign: "left" }}
          >
            Admins
          </Typography>
          <Stack spacing={2} direction="row" sx={{ py: 2 }}>
            <FaceOutlinedIcon />
            <Box fontWeight="fontWeightMedium" sx={{ alignContent: "end" }}>
              {creator}
            </Box>
            <p>(creator)</p>
          </Stack>
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              sx={{ mx: "auto" }}
              size="small"
            >
              Message Admin
            </Button>
          </Box>
        </Stack>
      </CardActions>
    </Card>
  );
}
