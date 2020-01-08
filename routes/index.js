var express = require('express')
var router = express.Router()

var passport = require('passport')
var User = require('../models/user')


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
    }), (req, res) => {
    })

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})


router.get('/register', (req, res) => {
    res.render('forms/register')
})
router.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username, name: req.body.name, contact: req.body.contact, email: req.body.email })
    User.register(newUser, req.body.password, (error, ir) => {
        if (error) {
            console.log('Error')
            return res.render('register')
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds')
        })
    })
})

module.exports = router