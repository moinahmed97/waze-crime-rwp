require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware (Allows JSON data and Cross-Origin requests)
app.use(express.json());
app.use(cors());

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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});