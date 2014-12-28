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
    return User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!bcrypt.compareSync(password, user.hash)) {
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
    if(req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  },
  isLoggedOut : function(req, res, next) {
    if(!req.session.user) {
      next();
    } else {
      res.redirect('/');
    }
  },
  login : function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err || !user) {
        req.session.flash = (!!info && info.hasOwnProperty('message')) ? info.message : 'User information could not be authenticated.';
        return res.redirect('/login');
      } else {
        req.session.user = user;
        next();
      }
    })(req, res, next);
  },
  logout : function(req, res, next) {
    req.session.user = null;
    res.redirect('/');
  },
  register: function(req, res, next) {
    // Please put in some verifications for registration data
      /* Make sure it is valid information
       * Make sure the email/username does not already exist
       * Make sure the password is encrypted
       * Proceed to necessary post-registration step */
    User.find({ $or : [ {username: req.body.username }, { email: req.body.email }]}).exec(function(err, user) {
      if(user.username === req.body.username) {
        req.session.flash = 'Username is already taken';
        res.redirect('/register');
      }

      var salt = bcrypt.genSaltSync(10),
          hash = bcrypt.hashSync(req.body.password, salt),
          user = new User({
            username : req.body.username,
            email : req.body.email,
            hash : hash
          });

      user.save();
      console.log('Registered User:', user);
      req.session.user = user;
    });

    user.save();
    next();
  }
}
