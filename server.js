import express from 'express';
import mongoose from 'mongoose';
import { ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

import blogRoutes from './routes/blogRoutes.js';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json()); // Parse JSON bodies from requests

app.use(cors()); // Enable CORS for all routes

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})
.then(() => {
  console.log('MongoDB connected');
  // Start the server after successful connection
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});


// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Blog API is running!' });
});

// Use blog routes
app.use('/api/blogs', blogRoutes);