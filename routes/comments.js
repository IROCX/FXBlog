var express = require('express')
var router = express.Router()
const {isLoggedIn, commentAuth} = require('../middlewares/authMiddleware');
const campgroundService = require('../services/campgroundService');
const commentService = require('../services/commentService');

// New Comment Form
router.get('/campgrounds/:id/comments/new', isLoggedIn, async(req, res) => {

    try {
        const campgroundId = req.params.id;
        const campground = await campgroundService.getCampgroundById(campgroundId);
        res.render('comments/new', { campground });
    } catch (error) {
        console.error(error.message);
        res.redirect('back');
    }
})

// Create Comment
router.post('/campgrounds/:id/comments', isLoggedIn, async(req, res) => {

    try {
        const campgroundId = req.params.id;
        const commentData = req.body.comment;
        const userId = req.user._id;
        const username = req.user.username;

        const createdComment = await commentService.createComment(campgroundId, commentData, userId, username);

        console.log("Self taken details:", createdComment);
        res.redirect('/campgrounds/' + campgroundId);
    } catch (error) {
        console.error(error.message);
        res.redirect('/campgrounds');
    }
})

// Edit Comment Form
router.get('/campgrounds/:id/comments/:commentid/edit', commentAuth, async(req, res) => {
    try {
        const commentId = req.params.commentid;
        const comment = await commentService.getCommentById(commentId);

        res.render('comments/edit', { editComment: comment, campground_id: req.params.id });
    } catch (error) {
        console.error(error.message);
        res.redirect('/campgrounds/' + req.params.id);
    }
})

// Update Comment
router.put('/campgrounds/:id/comments/:commentid', commentAuth, async(req, res) => {
    try {
        const commentId = req.params.commentid;
        const updatedData = req.body.comment;

        const updatedComment = await commentService.updateComment(commentId, updatedData);

        console.log('Comment updated successfully:', updatedComment);
        res.redirect('/campgrounds/' + req.params.id);
    } catch (error) {
        console.error(error.message);
        res.redirect('/campgrounds/' + req.params.id);
    }
})

// Delete Comment
router.delete('/campgrounds/:id/comments/:commentid', commentAuth, async(req, res) => {
    try {
        const commentId = req.params.commentid;

        await commentService.deleteComment(commentId);

        res.redirect('/campgrounds/' + req.params.id);
    } catch (error) {
        console.error(error.message);
        res.redirect('/campgrounds/' + req.params.id);
    }
})

module.exports = router