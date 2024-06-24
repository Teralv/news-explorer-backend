const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const usersController = require('../controllers/usersController');
const { createUserValidator, validateLogin } = require('../Utils/validator');


router.get(
  '/users/me',
  auth,
  usersController.getUserProfile
);
router.post(
  '/signup',
  createUserValidator,
  usersController.registerUser
);
router.post(
  '/signin',
  validateLogin,
  usersController.loginUser
);

module.exports = router;