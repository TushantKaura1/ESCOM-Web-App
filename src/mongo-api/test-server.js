// Simple test server to isolate routing issues
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Test routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server running' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test`);
}); 