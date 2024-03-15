const mongoose = require('mongoose')

const Schema = mongoose.Schema

const workoutSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  load: {
    type: Number,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  completed_days : {
    type: [String]
  },
  days_planned: {
    type: [String]
  }
}, { timestamps: true })

module.exports = mongoose.model('Workout', workoutSchema)