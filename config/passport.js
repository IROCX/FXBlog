import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import User from '../models/user.js';
import session from 'express-session';

export default function (app) {
  app.use(
    session({
      secret: 'IROC',
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
}