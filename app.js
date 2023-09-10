const ENV = require('dotenv')
ENV.config()

var moment = require('moment')
var fs = require('fs')

var express = require('express')
var app = express()
app.use(express.static('static'))
app.set('view engine', 'ejs')


var mongoose = require('mongoose')
var bp = require('body-parser')
var expressSanitizer = require('express-sanitizer')
var methodOverride = require('method-override')

var passport = require('passport')
var localStrategy = require('passport-local')
var User = require('./models/user.js')

var commentRoutes = require('./routes/comments')
var campgroundRoutes = require('./routes/campgrounds')
var indexRoutes = require('./routes/index')


mongoose.connect('mongodb+srv://' + process.env.uname + ':' + process.env.password + '@cluster0-ji2ke.azure.mongodb.net?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
        console.log('Connected to DB Successfully')
    }).catch(error => {
        console.log("Error : " + error.message)
    })

mongoose.set('useFindAndModify', false)
app.use(bp.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

app.use(expressSanitizer())
// seed()

//====================PASSPORT CONFIG===============================
app.use(require('express-session')({
    secret: 'IROC',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

app.use(indexRoutes)
app.use(campgroundRoutes)
app.use(commentRoutes)

app.listen(process.env.PORT);
