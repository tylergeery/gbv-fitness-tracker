'use strict';

var mongoose = require('mongoose'),
	User = require('../models/user');

module.exports = {
	main: function(req, res, next) {
		res.render('profile');
	}
}