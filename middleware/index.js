import Comment from '../models/comments.js';
import Post from '../models/posts.js';
import logger from '../config/logger.js';

const middleware = {};

middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

middleware.actionAuth = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const itemReturned = await Post.findById(req.params.id);
      if (
        itemReturned.author.id.equals(req.user._id) ||
        req.user._id.equals('5dc8f136e53c1f1d847bd643')
      ) {
        next();
      } else {
        res.redirect('back');
      }
    } else {
      res.redirect('back');
    }
  } catch (error) {
    logger.error('Error in actionAuth middleware:', error);
    res.redirect('back');
  }
};

middleware.commentAuth = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const itemReturned = await Comment.findById(req.params.commentid);
      if (
        itemReturned.author.id.equals(req.user._id) ||
        req.user._id.equals('5dc8f136e53c1f1d847bd643')
      ) {
        next();
      } else {
        res.redirect('back');
      }
    } else {
      res.redirect('back');
    }
  } catch (error) {
    logger.error('Error in commentAuth middleware:', error);
    res.redirect('back');
  }
};

export default middleware;
