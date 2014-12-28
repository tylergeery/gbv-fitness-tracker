'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  email: String,
  hash: String,
  bio: String,
  workouts: [String],
  teams: [String],
  isAdmin : {type: Number, default: 0},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  meta: {
    fans: {type: Number, default: 0},
    followers: {type: Number, default: 0}
  }
});

module.exports = mongoose.model('User', userSchema);