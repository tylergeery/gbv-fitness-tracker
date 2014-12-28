var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var workoutSchema = new Schema({
  title: String,
  description: String,
  activities: [String],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  meta: {
    votes: Number,
    favs:  Number
  }
});

module.exports = mongoose.model('Workout', workoutSchema);