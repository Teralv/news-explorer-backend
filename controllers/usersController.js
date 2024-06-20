const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../Utils/config');
const ConflictError = require('../middleware/handleErrors');
const NotFoundError = require('../middleware/handleErrors');
const UnauthorizedError = require('../middleware/handleErrors');
const ServerError = require('../middleware/handleErrors');
const logger = require('../middleware/logger');

exports.registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Usuario ya existente');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();
    const userToReturn = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    };
    return res
      .status(201)
      .json({ message: 'Usuario registrado correctamente', user: userToReturn });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: err.message,
      });
    }
    logger.error(`Registration error for ${req.body.email}: ${err.message}`);
    return next(err);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    res.json(user);
  } catch (err) {
    logger.error(
      `Error fetching profile for user ${req.user.id}: ${err.message}`,
    );
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('El correo electrónico o la contraseña son incorrectos');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('El correo electrónico o la contraseña son incorrectos');
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, jwtSecret, { expiresIn: '1d' }, (err, token) => {
      if (err) {
        throw new ServerError('Error signing token');
      }
      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    });
  } catch (err) {
    logger.error(`Login error for ${req.body.email}: ${err.message}`);
    next(err);
  }
};