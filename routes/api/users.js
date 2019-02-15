const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// @route    Get api/users/test
// @desc     Tests users route
// @access   Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Users works' });
});

// @route    Get api/users/register
// @desc     Register user
// @access   Public
router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    errors.email = 'Email already exists';
    return res.status(400).json(errors);
  } else {
    const avatar = gravatar.url(req.body.email, {
      s: '200', // Size
      r: 'pg', // Rating
      d: 'mm' // Default
    });
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
      password: req.body.password
    });

    try {
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      await newUser.save();
      res.json(newUser);
    } catch (error) {
      res.status(400).json({ error });
      console.log(error);
    }
  }
});

// @route    Get api/users/login
// @desc     Login User / Returning JWT Token
// @access   Public
router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    errors.email = 'User not found';
    return res.status(404).json(errors);
  }

  // Check Password
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    // User Matched
    const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload
    // Sign Token
    jwt.sign(
      payload,
      process.env.secretOrKey,
      { expiresIn: 604800 },
      (err, token) => {
        res.json({
          success: true,
          token: `Bearer ${token}`
        });
      }
    );
  } else {
    errors.password = 'Password incorrect';
    return res.status(400).json(errors);
  }
});

// @route    Get api/users/current
// @desc     Return current user
// @access   Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);

module.exports = router;
