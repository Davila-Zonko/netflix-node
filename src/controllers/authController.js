'use strict';

const User = require('../models/User');

/* ── GET /auth/login ─────────────────────── */
exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Sign In – Netflix' });
};

/* ── POST /auth/login ────────────────────── */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error_msg', 'Please fill in all fields.');
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findByEmail(email.trim().toLowerCase());

    if (!user || !(await User.verifyPassword(password, user.password))) {
      req.flash('error_msg', 'Incorrect email or password.');
      return res.redirect('/auth/login');
    }

    req.session.user = {
      id:    user.id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      plan:  user.plan,
    };

    res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
};

/* ── GET /auth/register ──────────────────── */
exports.showRegister = (req, res) => {
  res.render('auth/register', { title: 'Create Account – Netflix' });
};

/* ── POST /auth/register ─────────────────── */
exports.register = async (req, res) => {
  const { name, email, password, confirm_password, plan } = req.body;

  const errors = [];
  if (!name)                         errors.push('Name is required.');
  if (!email)                        errors.push('Email is required.');
  if (!/\S+@\S+\.\S+/.test(email))  errors.push('Enter a valid email address.');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
  if (password !== confirm_password) errors.push('Passwords do not match.');

  if (errors.length) {
    req.flash('error_msg', errors.join(' '));
    return res.redirect('/auth/register');
  }

  try {
    const existing = await User.findByEmail(email.trim().toLowerCase());
    if (existing) {
      req.flash('error_msg', 'An account with that email already exists.');
      return res.redirect('/auth/register');
    }

    const id = await User.create({
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password,
      plan:     ['basic', 'standard', 'premium'].includes(plan) ? plan : 'standard',
    });

    req.session.user = { id, name: name.trim(), email, role: 'user', plan };
    res.redirect('/');
  } catch (err) {
    console.error('Register error:', err);
    req.flash('error_msg', 'Registration failed. Please try again.');
    res.redirect('/auth/register');
  }
};

/* ── POST /auth/logout ───────────────────── */
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
};
