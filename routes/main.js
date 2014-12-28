'use strict';

var mongoose = require('mongoose'),
	BlogPosts = require('../models/blogPost'),
	User = require('../models/user');

mongoose.connect(process.env.MONGO_URL);

module.exports = {
	about: function(req, res, next) {
		res.render('about');
	},
	blog: function(req, res, next) {
		BlogPosts.find({}).sort({ created_at: -1}).exec(function(err, posts) {
			res.render('blog', {
				blogPosts : posts
			});
		});
	},
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
			var loginUrl = req.session.loginUrl;

			req.session.loginUrl = null;
			res.redirect(loginUrl);
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