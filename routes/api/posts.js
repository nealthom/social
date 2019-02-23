const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route    Get api/posts/
// @desc     Get posts
// @access   Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(404).json({ nopostfound: 'No posts found' });
  }
});

// @route    Get api/posts/:id
// @desc     Get posts
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(404).json({ nopostfound: 'No post found with that ID' });
  }
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

// @route    Delete api/posts/:id
// @desc     Delete post
// @access   Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ notauthorized: 'User not authorized' });
      }

      await post.remove();
      res.json({ success: true });
    } catch (error) {
      res.status(404).json({ postnotfound: 'No post found' });
    }
  }
);

module.exports = router;
