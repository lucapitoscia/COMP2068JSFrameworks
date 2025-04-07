const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// GET: Register page
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// POST: Handle registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error_msg', 'Username already exists');
      return res.redirect('/auth/register');
    }

    const newUser = new User({ username, password });
    await newUser.save();

    req.flash('success_msg', 'You are now registered! Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Registration failed');
    res.redirect('/auth/register');
  }
});

// GET: Login page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// POST: Handle login
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/habits',
    failureRedirect: '/auth/login',
    failureFlash: true
  })
);

// GET: GitHub login
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

// GET: GitHub callback
router.get('/github/callback',
  passport.authenticate('github', {
    successRedirect: '/habits',
    failureRedirect: '/auth/login'
  })
);

// GET: Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });
});

module.exports = router;
