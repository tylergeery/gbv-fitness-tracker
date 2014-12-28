var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var activitySchema = new Schema({
  title:  String,
  description: String,
  duration: [{ body: String, date: Date }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  meta: {
    votes: Number,
    favs:  Number
  }
});

module.exports = mongoose.model('Activity', activitySchema);