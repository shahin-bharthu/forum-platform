import { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Popper,
  InputAdornment,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import axiosInstance from "../../../../utils/axiosInstance";
import { clearNotification, setNotification } from "../../../store/slices/uiSlice";
import { useDispatch } from "react-redux";

// Define options outside the component
const getOptions = () => [
  {
    value: "DAILY",
    label: "Daily",
    icon: <TodayIcon fontSize="small" sx={{ color: "primary.main" }} />,
    tooltip: "Get daily notifications",
  },
  {
    value: "WEEKLY",
    label: "Weekly",
    icon: <DateRangeIcon fontSize="small" sx={{ color: "success.main" }} />,
    tooltip: "Get weekly notifications",
  },
  {
    value: "MONTHLY",
    label: "Monthly",
    icon: <CalendarMonthIcon fontSize="small" sx={{ color: "warning.main" }} />,
    tooltip: "Get monthly notifications",
  },
  {
    value: "NONE",
    label: "Never",
    icon: (
      <NotificationsOffIcon fontSize="small" sx={{ color: "text.secondary" }} />
    ),
    tooltip: "Disable notifications",
  },
];

export default function Notification(props) {
  const forum = props.forumId;

  // Store only the frequency value, not the entire option object
  const [frequencyValue, setFrequencyValue] = useState("DAILY");
  const [open,setOpen] = useState(false);
  const autoCompleteRedf = useRef(null);
  const options = getOptions();
  const dispatch = useDispatch();

  const getFrequency = useCallback(async (forum_id) => {
    try {
      const response = await axiosInstance.get(`/digest/frequency/${forum_id}`);
      if (response.status === 200) {
        const data = response.data.data;
        setFrequencyValue(data);
      }
    } catch (error) {
      console.error("Error fetching frequency:", error);
    }
  }, []);

  const handleFrequencyChange = useCallback(
    (event, newValue) => {
      if (!newValue) return;

      setFrequencyValue(newValue.value);

      axiosInstance
        .patch(`/digest/frequency/${forum}`, { frequency: newValue.value })
        .then((response) => {
          if (response.status === 200) {
            dispatch(
              setNotification({ message: `You will receive notification ${newValue.label} ` })
            );
            setTimeout(() => {
              dispatch(clearNotification());
            }, 1000);
          }
        })
        .catch((error) => {
          console.error("Error updating frequency:", error);
        });
    },
    [forum]
  );

  useEffect(() => {
    if (forum) {
      getFrequency(forum);
    }
  }, [forum, getFrequency]);

  // Find the current selected option based on the value
  const selectedOption =
    options.find((option) => option.value === frequencyValue) ||
    options.find((option) => option.value === "DAILY");

  return (
    <Box>
      <Autocomplete
        ref={autoCompleteRedf}
        id="notification-autocomplete"
        value={selectedOption}
        onChange={handleFrequencyChange}
        options={options}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        disableClearable
        autoHighlight
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            sx={{
              width: 50,
              input: { display: "none" },
              "& .MuiInputBase-root": {
                padding: 0,
                borderBottom: "none",
              },
            }}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="Notification Frequency">
                    <NotificationsIcon color="primary" />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li
            {...props}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              gap: "12px",
            }}
          >
            <Tooltip title={option.tooltip} placement="right">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ListItemIcon sx={{ minWidth: "auto" }}>
                  {option.icon}
                </ListItemIcon>
                <ListItemText primary={option.label} />
              </Box>
            </Tooltip>
          </li>
        )}
        PopperComponent={(props) => (
          <Popper
            {...props}
            placement="bottom-start"
            modifiers={[{ name: "offset", options: { offset: [0, 6] } }]}
            sx={{
              boxShadow: 3,
              width: 200,
              maxWidth: "100%",
              minWidth: 130,
              overflow: "hidden",
            }}
          />
        )}
        ListboxProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            width: "100%",
            overflow: "hidden",
            p: 1,
            backgroundColor: "background.paper",
            "& .MuiAutocomplete-option": {
              fontSize: 14,
              px: 2,
              py: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "action.hover",
              },
              "&[aria-selected='true']": {
                backgroundColor: "action.selected",
              },
            },
          },
        }}
      />
    </Box>
  );
}
