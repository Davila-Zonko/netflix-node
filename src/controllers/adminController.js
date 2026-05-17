'use strict';

const Movie  = require('../models/Movie');
const User   = require('../models/User');
const path   = require('path');
const multer = require('multer');
const fs     = require('fs');

/* ── Multer Setup ────────────────────────── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../public/images/uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
  },
});

exports.upload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'banner',    maxCount: 1 },
]);

/* ── Dashboard ───────────────────────────── */
exports.dashboard = async (req, res) => {
  try {
    const [totalMovies, totalUsers, recentMovies, users] = await Promise.all([
      Movie.count(),
      User.count(),
      Movie.getRecent(5),
      User.getAll(),
    ]);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard – Netflix',
      totalMovies,
      totalUsers,
      recentMovies,
      users: users.slice(0, 8),
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).render('500', { title: 'Error' });
  }
};

/* ── Movies List ─────────────────────────── */
exports.movies = async (req, res) => {
  try {
    const movies = await Movie.getAll({ limit: 200 });
    res.render('admin/movies', { title: 'Manage Movies – Admin', movies });
  } catch (err) {
    res.status(500).render('500', { title: 'Error' });
  }
};

/* ── Create Movie Form ───────────────────── */
exports.createMovieForm = (req, res) => {
  res.render('admin/movie-form', { title: 'Add Movie – Admin', movie: null });
};

/* ── Store Movie ─────────────────────────── */
exports.storeMovie = async (req, res) => {
  try {
    const data = extractMovieData(req.body, req.files);
    await Movie.create(data);
    req.flash('success_msg', 'Movie added successfully.');
    res.redirect('/admin/movies');
  } catch (err) {
    console.error('Store movie error:', err);
    req.flash('error_msg', 'Failed to add movie.');
    res.redirect('/admin/movies/create');
  }
};

/* ── Edit Movie Form ─────────────────────── */
exports.editMovieForm = async (req, res) => {
  try {
    const movie = await Movie.findById(parseInt(req.params.id));
    if (!movie) return res.redirect('/admin/movies');
    res.render('admin/movie-form', { title: 'Edit Movie – Admin', movie });
  } catch (err) {
    res.redirect('/admin/movies');
  }
};

/* ── Update Movie ────────────────────────── */
exports.updateMovie = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const existing = await Movie.findById(id);
    if (!existing) return res.redirect('/admin/movies');

    const data = extractMovieData(req.body, req.files, existing);
    await Movie.update(id, data);
    req.flash('success_msg', 'Movie updated successfully.');
    res.redirect('/admin/movies');
  } catch (err) {
    console.error('Update movie error:', err);
    req.flash('error_msg', 'Failed to update movie.');
    res.redirect(`/admin/movies/${id}/edit`);
  }
};

/* ── Delete Movie ────────────────────────── */
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.delete(parseInt(req.params.id));
    req.flash('success_msg', 'Movie deleted.');
  } catch (err) {
    req.flash('error_msg', 'Failed to delete movie.');
  }
  res.redirect('/admin/movies');
};

/* ── Users List ──────────────────────────── */
exports.users = async (req, res) => {
  try {
    const users = await User.getAll();
    res.render('admin/users', { title: 'Manage Users – Admin', users });
  } catch (err) {
    res.status(500).render('500', { title: 'Error' });
  }
};

/* ── Delete User ─────────────────────────── */
exports.deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  if (id === req.session.user.id) {
    req.flash('error_msg', 'You cannot delete your own account.');
    return res.redirect('/admin/users');
  }
  try {
    await User.delete(id);
    req.flash('success_msg', 'User deleted.');
  } catch (err) {
    req.flash('error_msg', 'Failed to delete user.');
  }
  res.redirect('/admin/users');
};

/* ── Helper ──────────────────────────────── */
function extractMovieData(body, files = {}, existing = {}) {
  const thumb = files?.thumbnail?.[0]
    ? '/images/uploads/' + files.thumbnail[0].filename
    : existing.thumbnail || '';

  const banner = files?.banner?.[0]
    ? '/images/uploads/' + files.banner[0].filename
    : existing.banner || '';

  return {
    title:        (body.title || '').trim(),
    description:  (body.description || '').trim(),
    genre:        (body.genre || '').trim(),
    release_year: parseInt(body.release_year) || new Date().getFullYear(),
    duration:     parseInt(body.duration) || 0,
    rating:       parseFloat(body.rating) || 0,
    thumbnail:    thumb,
    banner,
    video_url:    (body.video_url || '').trim(),
    cast_members: (body.cast_members || '').trim(),
    director:     (body.director || '').trim(),
    type:         ['movie', 'series'].includes(body.type) ? body.type : 'movie',
    featured:     body.featured ? 1 : 0,
  };
}
