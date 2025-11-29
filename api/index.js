// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

// 1. Middleware
app.use(cors({
    origin: ["https://healthcare-iota-lime.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(bodyParser.json());

// 2. Connection Logic (Works for both Serverless and Traditional Server)
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }
    
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

// 3. Schema Definition
const appointmentSchema = new mongoose.Schema({
    // Fields from Form A
    userName: String,
    userEmail: String,
    problemType: String,
    
    // Fields from Form B
    doctorId: String,
    specialize: String,
    patientName: String, 

    // Common fields
    doctorName: String,
    appointmentDate: Date,
    createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// 4. Routes
app.post('/api/appointments', async (req, res) => {
    await connectToDatabase();

    try {
        const { 
            userName, userEmail, doctorName, appointmentDate, problemType, 
            doctorId, specialize, patientName 
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

// Default route for testing health
app.get('/', (req, res) => {
    res.send("Healthcare Backend API is running!");
});

// =============================================================
// 5. CRITICAL FIX FOR RENDER DEPLOYMENT
// =============================================================
// Render assigns a port automatically in process.env.PORT
const PORT = process.env.PORT || 4000;

// This condition checks if the file is being run directly (Render uses 'npm start')
// If it is, we listen on the port.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// 6. Export for Vercel
// Vercel handles the listening automatically, so it just needs the export.
module.exports = app;