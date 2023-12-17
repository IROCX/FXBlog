var Comment = require('../models/comments')
var Campground = require('../models/campgrounds')

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

async function actionAuth(req, res, next) {
    try {
            if (!req.isAuthenticated())
            res.redirect('back');

        const itemReturned = await Campground.findById(req.params.id).exec();

        if (!itemReturned) {
            console.log("Campground not found");
            return res.redirect('back');
        }

        const isAuthorOrAdmin = itemReturned.author.id.equals(req.user._id) || req.user._id.equals('5dc8f136e53c1f1d847bd643');

        if (!isAuthorOrAdmin)
            return res.redirect('back');
        next();

    } catch (error) {
        res.redirect('back');
    }
}

const commentAuth = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            const commentId = req.params.commentid;
            const comment = await Comment.findById(commentId);

            if (!comment) {
                console.log("Comment not found");
                return res.redirect('back');
            }

            const isAuthorOrAdmin = comment.author.id.equals(req.user._id) || req.user._id.equals('5dc8f136e53c1f1d847bd643');

            if (isAuthorOrAdmin) {
                next();
            } else {
                res.redirect('back');
            }
        } else {
            console.log('Please log in...');
            res.redirect('back');
        }
    } catch (error) {
        console.error(error);
        res.redirect('back');
    }
};


module.exports = { isLoggedIn, actionAuth, commentAuth };
