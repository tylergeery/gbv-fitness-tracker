'use strict';

var mongoose = require('mongoose'),
	User = require('../models/user');

mongoose.connect(process.env.MONGO_URL);

module.exports = {
	index: function(req, res, next) {
		console.log('Hitting the index route');
		res.render('main');
	}
}