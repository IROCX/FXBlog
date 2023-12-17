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


router.post('/login',
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('error', 'Invalid username or password');
                return res.redirect('/login');
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash('success', 'Logged in successfully!');
                return res.redirect('/campgrounds');
            });
        })(req, res, next);
    })

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

router.get('/register', (req, res) => {
    res.render('forms/register', { previousValues: {} })
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
            req.flash('success', `Sign up successful! Welcome to FX Blog`);
            res.redirect('/campgrounds');
        });
    } catch (error) {
        console.log(error);
        req.flash('error', 'An error occurred during registration - ' + error.message);
        return res.render('forms/register', { previousValues: req.body });
    }
})

module.exports = router