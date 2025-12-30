const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://heart-practice.pages.dev',
    /\.pages\.dev$/
  ]
}));
app.use(express.json());

// API Routes
app.use('/api/scene', require('./api/scene'));
app.use('/api/chat', require('./api/chat'));
app.use('/api/review', require('./api/review'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
