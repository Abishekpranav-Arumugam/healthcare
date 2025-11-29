// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

app.use(cors({
    origin: ["https://healthcare-iota-lime.vercel.app", "http://localhost:3000"], // Add your Vercel URL here
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(bodyParser.json());

// 2. Connection Logic Update: Optimized for Serverless (Caching)
// We don't use app.listen here anymore.
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }
    
    // connecting to process.env.MONGODB_URI instead of localhost
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log("MongoDB Connected to Atlas");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

// 3. Schema Update: Merged fields from server.js and serverapp.js
const appointmentSchema = new mongoose.Schema({
    // Fields from server.js
    userName: String,
    userEmail: String,
    problemType: String,
    
    // Fields from serverapp.js
    doctorId: String,
    specialize: String,
    patientName: String, // Similar to userName

    // Common fields
    doctorName: String,
    appointmentDate: Date,
    createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// 4. Route Update: Handle the Logic
app.post('/api/appointments', async (req, res) => {
    await connectToDatabase();

    try {
        // We accept data from both your frontend forms
        const { 
            userName, userEmail, doctorName, appointmentDate, problemType, // from Form A
            doctorId, specialize, patientName // from Form B
        } = req.body;

        const newAppointment = new Appointment({
            userName: userName || patientName, // Fallback if one is missing
            userEmail,
            doctorName,
            appointmentDate,
            problemType,
            doctorId,
            specialize
        });

        await newAppointment.save();
        res.status(200).json({ message: 'Appointment saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving appointment', error });
    }
});

// Default route for testing
app.get('/', (req, res) => {
    res.send("Healthcare Backend API is running on Vercel!");
});

// 5. Export Update: Essential for Vercel
module.exports = app;