
const express = require('express');

const router = express.Router();

// Import individual route modules
const userRoutes = require('./userRoutes');
const articleRoutes = require('./articlesRoute');

// Setup route endpoints
router.use('/', userRoutes); // Assuming user routes include both protected and public routes
router.use('/', articleRoutes); // Protected article routes

module.exports = router;