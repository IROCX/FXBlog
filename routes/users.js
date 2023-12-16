var express = require('express')
var router = express.Router()
var Campground = require('../models/campgrounds')
var Comment = require('../models/comments')
var User = require('../models/user')
const campgroundService = require('../services/campgroundService');
const userService = require('../services/userService');
const {isLoggedIn, actionAuth} = require('../middlewares/authMiddleware');

router.get('/userprofile/:id', isLoggedIn, async(req, res) => {

    try {
        const userId = req.params.id;

        const user = await userService.getUserById(userId);
        const userPosts = await userService.getCampgroundsByUserId(userId);

        if (userId === '5dc8f136e53c1f1d847bd643') {
            const allUsers = await userService.getAllUsers();
            res.render("campgrounds/profile.ejs", { userDetails: userPosts, user, userlist: allUsers });
            console.log(allUsers);
        } else {
            res.render("campgrounds/profile.ejs", { userDetails: userPosts, user });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})


router.get('/user/destroy/:id', isLoggedIn, async(req, res) => {

    try {
        const userId = req.params.id;

        await userService.deleteUserById(userId);

        res.redirect('back');
    } catch (error) {
        console.error(error.message);
        res.redirect('back');
    }

})

module.exports = router
