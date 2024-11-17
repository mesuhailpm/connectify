const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const chatSocket = require('./sockets/chatSocket');
const http = require('http');
const cors = require('cors')

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "*", // Frontend URL
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));


// MongoDB connection
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/users', require ('./routes/userRoutes'))

// WebSocket setup
chatSocket(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
