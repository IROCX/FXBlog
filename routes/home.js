var express = require('express')
var router = express.Router()

var passport = require('passport')
const { validateRegistrationInput } = require('../helpers/validationHelper')
const userService = require('../services/userService');


router.get('/', (req, res) => {
    res.redirect('/campgrounds')
})

router.get('/about', (req, res) => {
    res.render('about')
})

//==================AUTH ROUTES===============================

router.get('/login', (req, res) => {
    res.render('forms/login')
})


router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => { })

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

router.get('/register', (req, res) => {
    res.render('forms/register', { previousValues: {}})
})

router.post('/register', async (req, res) => {
    const { username, name, contact, email, password, cpassword } = req.body;

    // Validate user input
    const validation = validateRegistrationInput(username, name, contact, email, password, cpassword);
    
    if (!validation.isValid) {
        const error = Object.keys(validation.errors)[0]
        req.flash('error', validation.errors[error]);
        return res.render('forms/register', { previousValues: req.body });
    }

    try {
        // Register user
        await userService.registerUser(username, name, contact, email, password);

        // Authenticate user
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    } catch (error) {
        console.log(error);
        req.flash('error', 'An error occurred during registration - ' + error.message);
        return res.render('forms/register', { previousValues: req.body });
    }
})

module.exports = router