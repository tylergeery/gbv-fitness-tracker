'use strict';

var mongoose = require('mongoose');

// mongoose.connect(process.env.mongoURL);

module.exports = {
	main: function(req, res, next) {
		res.render('index');
	},
	login: function(req, res, next) {
		res.render('login');
	},
	loggingIn: function(req, res, next) {
		if(!req.session.loginUrl) {
			res.redirect('/');
		} else {
			res.redirect(req.session.loginUrl);
		}
	}
}