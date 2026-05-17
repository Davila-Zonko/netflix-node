'use strict';

const Movie = require('../models/Movie');
const User  = require('../models/User');

/* ── GET /movies/:id ─────────────────────── */
exports.show = async (req, res) => {
  try {
    const movie = await Movie.findById(parseInt(req.params.id));
    if (!movie) return res.status(404).render('404', { title: 'Not Found' });

    const [similar, inMyList] = await Promise.all([
      Movie.getSimilar(movie.id, movie.genre || '', 8),
      User.isInList(req.session.user.id, movie.id),
    ]);

    await User.addToHistory(req.session.user.id, movie.id);

    res.render('movies/show', { title: `${movie.title} – Netflix`, movie, similar, inMyList });
  } catch (err) {
    console.error('Movie show error:', err);
    res.status(500).render('500', { title: 'Error' });
  }
};

/* ── GET /movies/:id/watch ───────────────── */
exports.watch = async (req, res) => {
  try {
    const movie = await Movie.findById(parseInt(req.params.id));
    if (!movie) return res.status(404).render('404', { title: 'Not Found' });

    await User.addToHistory(req.session.user.id, movie.id);
    res.render('movies/watch', { title: `Watch ${movie.title} – Netflix`, movie });
  } catch (err) {
    res.status(500).render('500', { title: 'Error' });
  }
};

/* ── GET /browse ─────────────────────────── */
exports.browse = async (req, res) => {
  try {
    const { genre, type } = req.query;
    const genres = await Movie.getGenres();

    let movies, pageTitle;

    if (genre) {
      movies    = await Movie.getByGenre(genre, 80);
      pageTitle = genre;
    } else if (type) {
      movies    = await Movie.getByType(type, 80);
      pageTitle = type === 'series' ? 'TV Shows' : 'Movies';
    } else {
      movies    = await Movie.getAll({ limit: 80 });
      pageTitle = 'Browse All Titles';
    }

    res.render('movies/browse', { title: `${pageTitle} – Netflix`, movies, pageTitle, genres });
  } catch (err) {
    res.status(500).render('500', { title: 'Error' });
  }
};
