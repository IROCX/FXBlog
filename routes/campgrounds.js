var express = require('express')
var router = express.Router()
var Campground = require('../models/campgrounds')
var Comment = require('../models/comments')
var User = require('../models/user')


router.get('/campgrounds', (req, res) => {

    //GET CAMPGROUNDS FROM DB
    Campground.find({}, (error, itemReturned) => {
        if (error)
            console.log(error)
        else {
            res.render('campgrounds/campgrounds', { campgrounds: itemReturned })
        }
    })
})


router.post('/campgrounds', isLoggedIn, (req, res) => {

    var name = req.body.name;
    var image = req.body.image;
    req.body.desc = req.sanitize(req.body.desc)
    var description = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newEntry = {
        name: name,
        image: image,
        description: description,
        author: author
    };
    console.log(newEntry)
    // CREATE A NEW CAMPGROUND IN DB
    Campground.create(newEntry, (error, itemReturned) => {
        if (error) {
            console.log(error)
        } else
            console.log('New Campground Created.')
    })
    res.redirect('/campgrounds');

})

router.get('/campgrounds/add', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((error, itemReturned) => {
        if (error) {
            console.log(error)
        } else {
            res.render('campgrounds/show', { foundCampground: itemReturned, SECRET_id: process.env.secret_id })
        }
    })
})


//====================Edit Route=================
router.get('/campgrounds/:id/edit', actionAuth, (req, res) => {
    Campground.findById(req.params.id, (error, itemReturned) => {
        res.render('campgrounds/edit', { editCampground: itemReturned })
    })
})

router.put('/campgrounds/:id', actionAuth, (req, res) => {
    // res.send('update campground route')
    console.log(req.body.updateData.desc)
    // req.body.updateData.desc = req.sanitize(req.body.updateData.desc)
    Campground.findByIdAndUpdate(req.params.id, req.body.updateData, (error, itemReturned) => {
        if (error) {
            console.log('Errrrrrooooooooooooooooooooooooooooooooooooooor')
        }
        res.redirect('/campgrounds/' + req.params.id)
    })
})


//========================DELETE Route=================
router.delete('/campgrounds/:id', actionAuth, (req, res) => {

    Campground.findById(req.params.id, (error, itemReturned) => {
        if (error) {
            console.log(error)
        } else {
            itemReturned.comments.forEach((value, index, array) => {
                Comment.findByIdAndDelete(value, (error) => {
                })
            })
            itemReturned.deleteOne()
            res.redirect('/campgrounds')
        }
    })
})



router.get('/userprofile/:id', isLoggedIn, (req, res) => {

    User.findById(req.params.id, (error, ir) => {
        if (error) {
            console.log('error==============================')
        } else {
            Campground.find({ "author.id": req.params.id }, (error, irPosts) => {
                if (error)
                    console.log('error')
                else {
                    if (req.params.id === '5dc8f136e53c1f1d847bd643') {
                        User.find({}, (error, allusers) => {
                            if (error) {
                                console.log('error')
                            } else {
                                res.render("campgrounds/profile.ejs", { userDetails: irPosts, user: ir, userlist: allusers })
                                console.log(allusers)
                            }
                        })
                    } else {
                        res.render("campgrounds/profile.ejs", { userDetails: irPosts, user: ir })
                    }
                }
            })
        }
    })
})


router.get('/user/destroy/:id', isLoggedIn, (req, res) => {

    Campground.find({ 'author.id': req.params.id }, (error, ir) => {
        if (error) {
            console.log('error in deleting users campgrounds')
        } else {
            // console.log('user to be deleted' + ir)
            ir.forEach((value) => {
                value.deleteOne()
            })
        }
    })
    User.findByIdAndRemove(req.params.id, (error, ir) => {
        if (error) {
            res.redirect('back')
        } else {
            res.redirect('back')
        }
    })

})

router.post('/search', isLoggedIn, (req, res) => {
    Campground.find({ 'author.username': req.body.user }, (error, ir) => {
        if (error) {
            res.redirect('/campgrounds')
        } else {
            res.render('campgrounds/searchtemplate', { searchedUser: ir, searchKey: req.body.user })
        }
    })
})


//=================MIDDLEWARE====================
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } res.redirect('/login')
}

function actionAuth(req, res, next) {
    if (req.isAuthenticated()) {
        //if login then check if its the author of the post
        Campground.findById(req.params.id, (error, itemReturned) => {
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
        res.redirect('back')
    }
}


module.exports = router