'use strict';

const Movie = require('../models/Movie');
const User  = require('../models/User');

/* ── GET / ───────────────────────────────── */
exports.index = async (req, res) => {
  try {
    const userId = req.session?.user?.id;

    const [featured, trending, newReleases, topRated, myList, genres] = await Promise.all([
      Movie.getFeatured(),
      Movie.getTrending(20),
      Movie.getNewReleases(20),
      Movie.getTopRated(20),
      userId ? User.getMyList(userId) : Promise.resolve([]),
      Movie.getGenres(),
    ]);

    // Load up to 5 genre rows
    const byGenre = {};
    await Promise.all(
      genres.slice(0, 5).map(async g => {
        byGenre[g] = await Movie.getByGenre(g, 20);
      })
    );

    res.render('home', {
      title: 'Home – Netflix',
      featured,
      trending,
      newReleases,
      topRated,
      myList,
      genres,
      byGenre,
    });
  } catch (err) {
    console.error('Home error:', err);
    res.status(500).render('500', { title: 'Error' });
  }
};

/* ── GET /search ─────────────────────────── */
exports.search = async (req, res) => {
  const q = (req.query.q || '').trim();
  try {
    const results = q ? await Movie.search(q) : [];
    res.render('search', { title: 'Search – Netflix', query: q, results });
  } catch (err) {
    res.status(500).render('500', { title: 'Error' });
  }
};

/* ── GET /my-list ────────────────────────── */
exports.myList = async (req, res) => {
  try {
    const myList = await User.getMyList(req.session.user.id);
    res.render('mylist', { title: 'My List – Netflix', myList });
  } catch (err) {
    res.status(500).render('500', { title: 'Error' });
  }
};

/* ── POST /list/add ──────────────────────── */
exports.addToList = async (req, res) => {
  try {
    await User.addToList(req.session.user.id, parseInt(req.body.movie_id));
    res.json({ success: true, action: 'added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update list' });
  }
};

/* ── POST /list/remove ───────────────────── */
exports.removeFromList = async (req, res) => {
  try {
    await User.removeFromList(req.session.user.id, parseInt(req.body.movie_id));
    res.json({ success: true, action: 'removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update list' });
  }
};
