require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware (Allows JSON data and Cross-Origin requests)
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 2. Define the 'Schema' (What a Crime Report looks like)
const ReportSchema = new mongoose.Schema({
  type: String, // e.g., "Robbery", "Harassment"
  lat: Number,
  lng: Number,
  description: String,
  date: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', ReportSchema);

// 3. Simple Test Route
app.get('/', (req, res) => {
  res.send('Safe Routes Backend is Running!');
});

// 4. Start the Server
const PORT = 5000;

// 5. Create a Route to Save a Report
app.post('/api/reports', async (req, res) => {
  try {
    // Get data from the "body" of the request
    const { type, lat, lng, description } = req.body;

    // Create a new Report in memory
    const newReport = new Report({ type, lat, lng, description });

    // Save it to the database
    await newReport.save();

    res.status(201).json({ message: "Report saved successfully!", report: newReport });
  } catch (error) {
    res.status(500).json({ error: "Failed to save report" });
  }
});

// 6. Create a Route to Get All Reports (So we can see them later)
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find(); // Get all from DB
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});