'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var blogPostSchema = new Schema({
  title: String,
  content: String,
  image: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);