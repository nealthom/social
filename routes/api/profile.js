const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route    Get api/profile/test
// @desc     Tests profile route
// @access   Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Profile works' });
});

// @route    Get api/profile
// @desc     Get current user profile
// @access   Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const errors = {};
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    } catch (error) {
      res.status(404).json(error);
    }
  }
);

module.exports = router;
