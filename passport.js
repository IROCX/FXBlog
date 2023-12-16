const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');

const setPassport = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};

module.exports = { setPassport };
