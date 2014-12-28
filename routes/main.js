'use strict';

var mongoose = require('mongoose'),
	User = require('../models/user');

mongoose.connect(process.env.MONGO_URL);

module.exports = {
	main: function(req, res, next) {
		res.render('index');
	},
	login: function(req, res, next) {
		var flash = req.session.flash;

		req.session.flash = '';
		res.render('login', {
			flash : flash
		});
	},
	loggingIn: function(req, res, next) {
		if(!req.session.loginUrl) {
			res.redirect('/');
		} else {
			res.redirect(req.session.loginUrl);
		}
	},
	register: function(req, res, next) {
		var flash = req.session.flash;

		req.session.flash = '';
		res.render('register', {
			flash : flash
		});
	},
	users: function(req, res, next) {
		return User.find({}).exec(function(err, users) {
			res.send(200, {
				users: users
			});
		})
	}
}