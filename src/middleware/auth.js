'use strict';

exports.requireAuth = (req, res, next) => {
  if (req.session.user) return next();
  req.flash('error_msg', 'Please log in to access this page.');
  res.redirect('/auth/login');
};

exports.requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') return next();
  if (!req.session.user) return res.redirect('/auth/login');
  res.status(403).render('403', { title: 'Forbidden' });
};

exports.requireGuest = (req, res, next) => {
  if (!req.session.user) return next();
  res.redirect('/');
};
