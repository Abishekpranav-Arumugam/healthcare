const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/healthcare', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define the appointment schema and model
const appointmentSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  doctorName: String,
  appointmentDate: Date,
  problemType: String
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Create a POST route to save appointment
app.post('/appointments', async (req, res) => {
  const { userName, userEmail, doctorName, appointmentDate, problemType } = req.body;

  try {
    const appointment = new Appointment({
      userName,
      userEmail,
      doctorName,
      appointmentDate,
      problemType
    });

    await appointment.save();
    res.status(200).json({ message: 'Appointment saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving appointment', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
