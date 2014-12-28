'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
  },
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

module.exports = {
  adminLogin : function(req, res, next) {
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    // Store session for Admin User
  },
  isAdminLoggedIn : function(req, res, next) {
    // Check for session of Admin User
    if(req.user ) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  },
  isLoggedIn : function(req, res, next) {
    if(req.user) {
      next();
    } else {
      res.redirect('/login');
    }
  },
  login : function(req, res, next) {
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  },
  logout : function(req, res, next) {
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
  }
}
