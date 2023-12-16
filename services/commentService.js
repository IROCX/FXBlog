const campgroundService = require('../services/campgroundService');
var Comment = require('../models/comments')

async function createComment(campgroundId, commentData, userId, username) {
    try {
        const campground = await campgroundService.getCampgroundById(campgroundId);

        const newComment = {
            ...commentData,
            author: {
                id: userId,
                username: username,
            },
        };

        const createdComment = await Comment.create(newComment);

        // Add user details to the comment
        createdComment.author.id = userId;
        createdComment.author.username = username;
        await createdComment.save();

        // Add comment to the campground
        campground.comments.push(createdComment);
        await campground.save();

        return createdComment;
    } catch (error) {
        throw new Error(`Error creating comment: ${error.message}`);
    }
}

async function getCommentById(commentId) {
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }
        return comment;
    } catch (error) {
        throw new Error(`Error getting comment by ID: ${error.message}`);
    }
}

async function updateComment(commentId, updatedData) {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(commentId, updatedData, { new: true });
        if (!updatedComment) {
            throw new Error('Comment not found');
        }
        return updatedComment;
    } catch (error) {
        throw new Error(`Error updating comment: ${error.message}`);
    }
}

async function deleteComment(commentId) {
    try {
        await Comment.findByIdAndDelete(commentId);
    } catch (error) {
        throw new Error(`Error deleting comment: ${error.message}`);
    }
}

module.exports = {
    createComment, getCommentById, updateComment, deleteComment
};