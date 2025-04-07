// Luca Pitoscia
// Assignment 02 Habit Tracker CRUD App
// models/Habit.js

const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  frequency: {
    type: String, 
    required: true
  },
  completedDates: {
    type: [Date], 
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Habit', HabitSchema);
