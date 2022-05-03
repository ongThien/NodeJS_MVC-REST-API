const express = require('express');

const { body } = require('express-validator/check');

const feedController = require('../controllers/feedController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

//GET - all posts @/feed/posts
router.get('/posts', isAuth, feedController.getPosts);

//POST - create a new post @/feed/post
router.post(
  '/post',
  isAuth,
  [
    body('title')
    .trim()
    .isLength({min: 5}),
    body('content')
    .trim()
    .isLength({min: 5})
  ],
  feedController.createPost
);

//GET - a single post
router.get('/post/:postId', isAuth, feedController.getPost);

//PUT - update a post
router.put(
  '/post/:postId',
  isAuth,
  [
    body('title')
    .trim()
    .isLength({min: 5}),
    body('content')
    .trim()
    .isLength({min: 5})
  ],
  feedController.updatePost
);

//DELETE - delete a post
router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;