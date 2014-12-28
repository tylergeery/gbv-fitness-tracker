'use strict';

var bcrypt = require('bcryptjs'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
  },
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
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
    if(!!req.user) {
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
    passport.authenticate('local', function(err, user, info) {
      if (err || !user) {
        req.session.flash = (!!info && info.hasOwnProperty('message')) ? info.message : 'User information could not be authenticated.';
        return res.redirect('/login');
      } else {
        console.log('login authenticated');
        next();
      }
    })(req, res, next);
  },
  logout : function(req, res, next) {
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
  },
  register: function(req, res, next) {
    // Please put in some verifications for registration data
      /* Make sure it is valid information
       * Make sure the email/username does not already exist
       * Make sure the password is encrypted
       * Proceed to necessary post-registration step */
    var salt = bcrypt.genSaltSync(10),
        hash = bcrypt.hashSync("B4c0/\/", salt),
        user = new User({
          username : req.body.username,
          email : req.body.email,
          hash : hash
        });

    user.save();
    next();
  }
}
