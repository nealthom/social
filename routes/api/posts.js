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

// @route    Post api/posts/like/:id
// @desc     Like post
// @access   Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      const index = post.likes.findIndex(like => {
        return like.user == req.user.id;
      });

      if (index === -1) {
        // Add user id to likes array
        post.likes.push({
          user: req.user.id
        });
        await post.save();
        res.json(post);
      } else {
        return res
          .status(400)
          .json({ alreadyliked: 'User already liked this post' });
      }
    } catch (error) {
      res.status(404).json({ postnotfound: 'No post found' });
    }
  }
);

// @route    Post api/posts/unlike/:id
// @desc     Unlike post
// @access   Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      const index = post.likes.findIndex(like => {
        return like.user == req.user.id;
      });

      if (index === -1) {
        return res
          .status(400)
          .json({ notliked: 'User has not liked this post' });
      } else {
        // Remove like from array
        post.likes.splice(index, 1);
        await post.save();
        res.json(post);
      }
    } catch (error) {
      res.status(404).json({ postnotfound: 'No post found' });
    }
  }
);

// @route    Post api/posts/comment/:id
// @desc     Add comment to post
// @access   Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    // Get Post
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ postNotFound: 'Post  not found' });
    }

    const newComment = {
      text: req.body.text,
      name: req.user.name,
      avatar: req.user.avatar,
      user: req.user.id
    };

    // Add to comments array
    post.comments.push(newComment);
    await post.save();
    res.json(post);
  }
);
// @route    Delete api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access   Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // Get the post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ postNotFound: 'Post  not found' });
    }
    // Find the comment to delete
    const commentIndex = post.comments.findIndex(
      comment => comment._id == req.params.comment_id
    );
    // return if the comment isn't found
    if (commentIndex === -1) {
      return res.status(400).json({ commentNotfound: 'Comment not found' });
    }
    // Check if the current user is the same as the user of the comment
    if (post.user != req.user.id) {
      return res
        .status(401)
        .json({ notauthorized: "You can't delete this comment" });
    }

    // Remove like from array
    post.comments.splice(commentIndex, 1);
    await post.save();
    res.json(post);
  }
);

module.exports = router;
