const express = require('express');
const connectDB = require('./db');
const routes = require('../backend/routes/routes');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});