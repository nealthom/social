const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');
// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route    Get api/profile/all
// @desc     Get all profiles
// @access   Public
router.get('/all', async (req, res) => {
  try {
    const errors = {};
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    if (!profiles) {
      errors.noprofile = 'There are no profiles';
      return res.status(404).json(errors);
    }
    res.json(profiles);
  } catch (error) {
    res.status(404).json({ profile: 'There are no profiles' });
  }
});

// @route    Get api/profile/handle/:handle
// @desc     Get profile by handle
// @access   Public
router.get('/handle/:handle', async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({
      handle: req.params.handle
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors);
    }
    res.json(profile);
  } catch (error) {
    res.status(404).json(error);
  }
});

// @route    Get api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors);
    }
    res.json(profile);
  } catch (error) {
    res.status(404).json({ profile: 'There is no profile for this user' });
  }
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

// @route    POST api/profile
// @desc     Create or Edit user profile
// @access   Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    // Topics - split into array

    if (typeof req.body.topics !== 'undefined') {
      profileFields.topics = req.body.topics.split(',');
    }
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    const profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      // Update
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).populate('user', ['name', 'avatar']);
      res.json(updatedProfile);
    } else {
      // Create

      // Check if handle exists
      let profile = await Profile.findOne({ handle: profileFields.handle });
      if (profile) {
        errors.handle = 'That handle already exists';
        res.status(400).json(errors);
      }

      profile = new Profile(profileFields).save();
      res.json(profile);
    }
  }
);
module.exports = router;
