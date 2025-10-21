const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  muscleGroups: [{
    type: String,
    required: true
  }],
  workoutPlan: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: {
    type: String,
    maxlength: 500
  },
  duration: {
    type: Number, // in minutes
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
workoutSchema.index({ userId: 1, generatedAt: -1 });

module.exports = mongoose.model('Workout', workoutSchema); 