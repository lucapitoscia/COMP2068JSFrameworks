// Luca Pitoscia
// Assignment 02 Habit Tracker CRUD App
// routes/habits.js

const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// Middleware to protect private routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to access this page');
  res.redirect('/auth/login');
}

//  GET: Showing all habits (Private)
router.get('/', ensureAuthenticated, async (req, res) => {
  const habits = await Habit.find({ user: req.user._id });
  res.render('habits/index', { habits });
});

// GET: Showing add habit form (Private)
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('habits/add');
});

// POST: Adding new habit (Private)
router.post('/add', ensureAuthenticated, async (req, res) => {
  const { name, frequency } = req.body;
  await Habit.create({ name, frequency, user: req.user._id });
  res.redirect('/habits');
});

// GET: Show edit habit form (Private)
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) {
    req.flash('error_msg', 'Habit not found');
    return res.redirect('/habits');
  }
  res.render('habits/edit', { habit });
});

// POST: Update habit (Private)
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  const { name, frequency } = req.body;
  await Habit.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { name, frequency }
  );
  res.redirect('/habits');
});

// POST: Deleting the habit (Private)
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.redirect('/habits');
});

// GET: Showing progress chart for a habit (Private)
router.get('/progress/:id', ensureAuthenticated, async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) {
    req.flash('error_msg', 'Habit not found');
    return res.redirect('/habits');
  }

  res.render('habits/progress', {
    habit,
    completedDatesJSON: JSON.stringify(habit.completedDates)
  });
});

// POST: Marking the habit as completed (Private)
router.post('/complete/:id', ensureAuthenticated, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (!habit) {
    req.flash('error_msg', 'Habit not found');
    return res.redirect('/habits');
  }

  const existing = habit.completedDates.map(date =>
    new Date(date).toISOString().split('T')[0]
  );

  if (!existing.includes(today)) {
    habit.completedDates.push(new Date());
    await habit.save();
  }

  res.redirect('/habits');
});

// GET: Public habits list (Read-Only)

router.get('/public', async (req, res) => {
  const habits = await Habit.find({ user: null });
  res.render('habits/public', { habits });
});

module.exports = router;
