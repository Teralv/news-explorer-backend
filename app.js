import express, { json, urlencoded } from 'express';
import  connect  from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import  errors  from 'celebrate'; // Celebrate error handler
import { error as _error, info } from './middleware/logger';
import apiRateLimiter from './Utils/rateLimiter';
import  errorHandler  from './middleware/handleErrors';
import { mongoUri, port } from './Utils/config';
import routes from './Routes/index';

require('dotenv').config(); // This will load .env file if it exists


const app = express();

// MongoDB connection
connect(mongoUri)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    _error(`Database Connection Error: ${err.message}`);
    process.exit(1); // Exit the process if unable to connect to the database
  });

// Security middleware to set various HTTP headers
app.use(helmet());
app.use(cors());

// Built-in middleware for parsing JSON and urlencoded form data
app.use(json());
app.use(urlencoded({ extended: true }));

// Rate limiting middleware applied to all API requests
app.use('/api', apiRateLimiter);

// Simple request logger middleware
app.use((req, res, next) => {
  info(`Received ${req.method} request at ${req.url}`);
  next();
});

app.use('/', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Catch 404 and directly return a 404 response
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
});

// Celebrate error handler to catch and format validation errors
app.use(errors());

// General error handling middleware
app.use(errorHandler);

export default app;