const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000; // Set a port other than 5000

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/appointments', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
    doctorId: String,
    doctorName: String,
    specialize: String,
    patientName: String,
    appointmentDate: Date,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Route to handle appointment creation
app.post('/api/appointments', async (req, res) => {
    try {
        const { doctorId, doctorName, specialize, patientName, appointmentDate } = req.body;
        const newAppointment = new Appointment({
            doctorId,
            doctorName,
            specialize,
            patientName,
            appointmentDate
        });
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
