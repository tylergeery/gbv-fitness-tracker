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
    if(!!req.session.user.isAdmin) {
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
    //TODO: enhance input verification
    if(!req.body.username) {
      req.session.flash = 'Please provide a username';
      res.redirect('/register');
    } else if(!req.body.email) {
      req.session.flash = 'Please provide an email';
      res.redirect('/register');
    } else if(!req.body.password) {
      req.session.flash = 'Please provide a password';
      res.redirect('/register');
    } else if(req.body.password !== req.body.confirm_password) {
      req.session.flash = 'Password must match the confirm password';
      res.redirect('/register');
    }

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
      req.session.user = user;
      next();
    });
  }
}
