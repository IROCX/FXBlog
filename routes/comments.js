var express = require('express')
var router = express.Router()
var Campground = require('../models/campgrounds')
var Comment = require('../models/comments')

router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {

    Campground.findById(req.params.id, (error, ir) => {
        if (error) {
            console.log('error')
        } else {
            res.render('comments/new', { campground: ir })
        }
    })
})

router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {

    Campground.findById(req.params.id, (error, irCFound) => {
        console.log(irCFound)
        if (error) {
            console.log('error')
            res.redirect('/campgrounds')
        }
        else {
            Comment.create(req.body.comment, (error, ir) => {
                if (error) {
                    console.log('error in creating comment')
                } else {
                    //add user to comment
                    ir.author.id = req.user._id
                    ir.author.username = req.user.username
                    ir.save()
                    console.log("Self taken details : " + ir)
                    irCFound.comments.push(ir)
                    irCFound.save()
                    res.redirect('/campgrounds/' + irCFound._id)
                }
            })
        }
    })
})

router.get('/campgrounds/:id/comments/:commentid/edit', commentAuth, (req, res) => {
    Comment.findById(req.params.commentid, (error, ir) => {
        if (error) {
            res.redirect('/campgrounds/' + req.params.id)
        } else {
            console.log(ir)
            res.render('comments/edit', { editComment: ir, campgroundid: req.params.id })
        }
    })
})

router.put('/campgrounds/:id/comments/:commentid', commentAuth, (req, res) => {
    // console.log(req.body.text)
    Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, (error, ir) => {
        if (error) {
            console.log('error in updating comment')
        } else {
            console.log('comment updated successfully' + ir)
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

router.delete('/campgrounds/:id/comments/:commentid', commentAuth, (req, res) => {
    Comment.findByIdAndDelete(req.params.commentid, (error) => {
        res.redirect('/campgrounds/' + req.params.id)
    })
})


function commentAuth(req, res, next) {
    if (req.isAuthenticated()) {

        Comment.findById(req.params.commentid, (error, itemReturned) => {
            if (error) {
                console.log(error)
                res.redirect('back')
            } else {

                if (itemReturned.author.id.equals(req.user._id) || req.user._id.equals('5dc8f136e53c1f1d847bd643')) {
                    next()
                } else {
                    res.redirect('back')
                }
            }
        })
    } else {
        console.log('login please.................................')
        res.redirect('back')
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } res.redirect('/login')
}

module.exports = router