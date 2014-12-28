var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  bio: String,
  workouts: [String],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  meta: {
    fans: Number,
    followers:  Number
  }
});

module.exports = mongoose.model('User', userSchema);