require('dotenv').config();
const express = require('express');
const cors = require('cors');
const campaignRoutes = require('./routes/campaignRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// All routes will be available at http://localhost:3000/api/...
app.use('/api', campaignRoutes);

// Simple Health Check for the Root URL
app.get('/', (req, res) => {
    res.json({ message: 'Phishing Simulator API is running correctly!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Phishing Simulator Backend running on port ${PORT}`);
});
