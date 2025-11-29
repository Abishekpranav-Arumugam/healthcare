import React from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// FIX 1: Updated Imports for Date Picker (MUI X v5/v6)
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import swal from "sweetalert";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import useAuth from "../../../Hooks/useAuth";

const Appointment = () => {
  const { user } = useAuth();
  const [value, setValue] = React.useState(new Date());
  const [docName, setDocName] = React.useState("");
  const [problemType, setProblemType] = React.useState("");

  const handleDoctorChange = (event) => {
    setDocName(event.target.value);
  };

  const handleProblemTypeChange = (event) => {
    setProblemType(event.target.value);
  };

  // Function to save appointment to backend
  const saveAppointment = () => {
    // Basic Validation
    if (!docName || !problemType) {
        swal("Missing Info", "Please select a doctor and describe your problem.", "warning");
        return;
    }

    const appointmentData = {
      userName: user.displayName,
      userEmail: user.email,
      doctorName: docName,
      appointmentDate: value,
      problemType: problemType
    };

    // FIX 2: Updated URL to include '/api'
    fetch('https://healthcare-0o0j.onrender.com/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    })
      .then(async (response) => {
        // FIX 3: Check response status before declaring success
        const data = await response.json();
        
        if (!response.ok) {
            // If server returns 404 or 500, throw an error
            throw new Error(data.message || "Failed to book appointment");
        }
        
        // If we get here, it was actually successful
        console.log('Success:', data);
        swal("Your Appointment is Done! You will receive a mail ASAP.", {
          button: false,
          icon: "success",
        });
      })
      .catch((error) => {
        // Handle Errors (Network or Server)
        console.error('Error:', error);
        swal("Booking Failed", error.message || "Something went wrong. Please try again.", "error");
      });
  };

  return (
    <Box
      id="appointment"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <Container style={{ justifyContent: "center" }}>
          <Typography
            variant="h5"
            sx={{
              mt: 5,
              mb: 5,
            }}
          >
            Select your time and date for Appointment
          </Typography>
        </Container>
        
        {/* Doctor Name Selection */}
        <FormControl sx={{ mb: 5, minWidth: "50%" }}>
          <InputLabel id="doctor-select-label">Select Doctor Name</InputLabel>
          <Select
            labelId="doctor-select-label"
            id="doctor-select"
            value={docName}
            onChange={handleDoctorChange}
            autoWidth
            label="Select Doctor Name"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Dr. Neha A Agrawal">Dr. Neha A Agrawal</MenuItem>
            <MenuItem value="Dr. Vrushali Naik">Dr. Vrushali Naik</MenuItem>
            <MenuItem value="Dr. Tejaswini Manogna">Dr. Tejaswini Manogna</MenuItem>
            <MenuItem value="Dr. Aditya Gupta">Dr. Aditya Gupta</MenuItem>
            <MenuItem value="Dr. Vivek k Bansode">Dr. Vivek K Bansode</MenuItem>
            <MenuItem value="Dr. Pratima J Singh">Dr. Pratima J Singh</MenuItem>
            <MenuItem value="Dr. Amit Lanke">Dr. Amit Lanke</MenuItem>
            <MenuItem value="Dr. Johnny Pandit">Dr. Johnny Pandit</MenuItem>
            <MenuItem value="Dr. Sandip Nehe">Dr. Sandip Nehe</MenuItem>
          </Select>
        </FormControl>

        <TextField
          sx={{ mb: 2 }}
          value={user.displayName || ""}
          fullWidth
          label="Your Name"
          id="user-name"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          sx={{ mb: 2 }}
          value={user.email || ""}
          fullWidth
          label="Your Mail"
          id="user-email"
          InputProps={{
            readOnly: true,
          }}
        />

        {/* Updated Date Picker Implementation */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDateTimePicker
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              label="Appointment Date"
              onError={console.log}
              minDate={new Date()}
              // inputFormat/mask might be deprecated in v6, but usually work in v5.
              // If this causes error, remove inputFormat and mask.
              inputFormat="yyyy/MM/dd hh:mm a"
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>

        <TextField
          sx={{ mt: 2, mb: 2 }}
          fullWidth
          label="Problem Type"
          id="problem-type"
          value={problemType}
          onChange={handleProblemTypeChange} 
        />

        <Button
          sx={{ p: 1, mt: 2, mb: 5 }}
          onClick={saveAppointment}
          fullWidth
          variant="contained"
        >
          <AddCircleIcon /> Confirm
        </Button>
      </Container>
    </Box>
  );
};

export default Appointment;