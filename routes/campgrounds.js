var express = require('express')
var router = express.Router()
var Campground = require('../models/campgrounds')
var Comment = require('../models/comments')
var User = require('../models/user')
const campgroundService = require('../services/campgroundService');
const userService = require('../services/userService');

router.get('/campgrounds', async (req, res) => {

    try {
        const campgrounds = await campgroundService.getAllCampgrounds();
        res.render('campgrounds/campgrounds', { campgrounds });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/campgrounds', isLoggedIn, async (req, res) => {

    try {
        const { name, image, description } = req.body;
        const sanitizedDescription = req.sanitize(description);
        const author = {
            id: req.user._id,
            username: req.user.username
        };

        await campgroundService.createCampground(name, image, sanitizedDescription, author);

        res.redirect('/campgrounds');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }

})

router.get('/campgrounds/add', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.get('/campgrounds/:id', async(req, res) => {
    try {
        const campgroundId = req.params.id;
        const foundCampground = await campgroundService.getCampgroundByIdWithComments(campgroundId);

        res.render('campgrounds/show', { foundCampground, SECRET_id: process.env.secret_id });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})


router.get('/campgrounds/:id/edit', actionAuth, async(req, res) => {
    try {
        const campgroundId = req.params.id;
        const editCampground = await campgroundService.getCampgroundById(campgroundId);

        res.render('campgrounds/edit', { editCampground });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

router.put('/campgrounds/:id', actionAuth, async(req, res) => {
    try {
        const campgroundId = req.params.id;
        const updateData = req.body.updateData;

        // Uncomment the line below if you want to sanitize the description
        updateData.desc = req.sanitize(updateData.desc);

        const updatedCampground = await campgroundService.updateCampground(campgroundId, updateData);

        res.redirect(`/campgrounds/${campgroundId}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})


router.delete('/campgrounds/:id', actionAuth, async(req, res) => {

    try {
        const campgroundId = req.params.id;

        await campgroundService.deleteCampgroundById(campgroundId);

        res.redirect('/campgrounds');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})



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

router.post('/search', isLoggedIn, async(req, res) => {
    try {
        const searchedUser = req.body.user;
        const campgrounds = await campgroundService.searchCampgroundsByUser(searchedUser);

        res.render('campgrounds/searchtemplate', { searchedUser: campgrounds, searchKey: searchedUser });
    } catch (error) {
        console.error(error.message);
        res.redirect('/campgrounds');
    }
})


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

async function actionAuth(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            const itemReturned = await Campground.findById(req.params.id).exec();

            if (!itemReturned) {
                console.log("Campground not found");
                return res.redirect('back');
            }

            const isAuthorOrAdmin = itemReturned.author.id.equals(req.user._id) || req.user._id.equals('5dc8f136e53c1f1d847bd643');

            if (isAuthorOrAdmin) {
                next();
            } else {
                res.redirect('back');
            }
        } else {
            res.redirect('back');
        }
    } catch (error) {
        console.error(error);
        res.redirect('back');
    }
}


module.exports = router