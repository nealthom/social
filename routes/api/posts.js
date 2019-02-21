const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');

// Validation
const validatePostInput = require('../../validation/post');

// @route    Get api/posts/test
// @desc     Tests post route
// @access   Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Posts works' });
});

// @route    Post api/posts/
// @desc     Create post
// @access   Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.user.name,
      avatar: req.user.avatar,
      user: req.user.id
    });
    const post = await newPost.save();
    res.json(post);
  }
);

module.exports = router;
