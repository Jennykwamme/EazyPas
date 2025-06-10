const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, selectedSubjects, role } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      selectedSubjects,
      role: role || 'user', // Default to 'user' if role is not provided
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        selectedSubjects: user.selectedSubjects,
        role: user.role,
        token: jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '30d' }),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.isValidPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        selectedSubjects: user.selectedSubjects,
        role: user.role,
        token: jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '30d' }),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { registerUser, loginUser };
