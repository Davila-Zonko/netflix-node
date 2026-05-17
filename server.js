'use strict';

require('dotenv').config();

const express        = require('express');
const session        = require('express-session');
const flash          = require('connect-flash');
const methodOverride = require('method-override');
const path           = require('path');


// Import Routes
const authRoutes   = require('./src/routes/auth');
const homeRoutes   = require('./src/routes/home');
const movieRoutes  = require('./src/routes/movies');
const adminRoutes  = require('./src/routes/admin');

const app = express();

/* ── View Engine ──────────────────────────── */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

/* ── Middleware ───────────────────────────── */
// app.use(compression()); // Compression disabled (compression module not installed) 

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

/* ── Session Configuration ────────────────── */
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_key', // Fallback for safety
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only secure in production (HTTPS)
    maxAge: 1000 * 60 * 60 * 24 * 7,               // 7 days
    httpOnly: true                                  // XSS Protection
  }
}));

/* ── Flash Messages ───────────────────────── */
app.use(flash());

/* ── Global Context (Locals) ──────────────── */
app.use((req, res, next) => {
  res.locals.user        = req.session.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg   = req.flash('error_msg');
  res.locals.error       = req.flash('error');
  // Add a global helper for the current year
  res.locals.currentYear = new Date().getFullYear();
  next();
});

/* ── Routes ───────────────────────────────── */
app.use('/',       homeRoutes);
app.use('/auth',   authRoutes);
app.use('/movies', movieRoutes);
app.use('/admin',  adminRoutes);

/* ── 404 Handler (Not Found) ──────────────── */
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '404 - Page Not Found',
    message: "The page you're looking for doesn't exist." 
  });
});

/* ── 500 Global Error Handler ─────────────── */
app.use((err, req, res, next) => {
  // Enhanced Error Logging
  console.error('\n❌ [SERVER ERROR]:', err.message);
  console.error('Stack:', err.stack);
  console.error('Request URL:', req.originalUrl);
  console.error('Method:', req.method, '\n');

  const statusCode = err.status || 500;
  
  res.status(statusCode).render('500', { 
    title: '500 - Server Error', 
    // Show full error message only in development mode
    error: process.env.NODE_ENV === 'development' ? err.stack : 'We are experiencing a technical problem.'
  });
});

/* ── Start Server ─────────────────────────── */
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Netflix Clone is live!`);
  console.log(`🔗 URL:   http://localhost:${PORT}`);
  console.log(`👤 Admin: http://localhost:${PORT}/admin`);
  console.log(`📁 Env:   ${process.env.NODE_ENV || 'development'}\n`);
});

// Graceful Shutdown (Good practice for DB connections)
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated.');
  });
});

module.exports = app; // For testing