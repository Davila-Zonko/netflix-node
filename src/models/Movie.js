'use strict';

const db = require('../config/database');

class Movie {
  /* ── Single ─────────────────────────────── */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM movies WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }

  /* ── Lists ──────────────────────────────── */
  static async getAll({ limit = 100, offset = 0 } = {}) {
    const [rows] = await db.query(
      'SELECT * FROM movies ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }

  static async getFeatured() {
    const [rows] = await db.query(
      'SELECT * FROM movies WHERE featured = 1 ORDER BY RAND() LIMIT 1'
    );
    return rows[0] || null;
  }

  static async getTrending(limit = 20) {
    // Movies with most recent watch activity this week
    const [rows] = await db.query(
      `SELECT m.*, COUNT(wh.movie_id) AS watch_count
       FROM movies m
       LEFT JOIN watch_history wh
         ON m.id = wh.movie_id
         AND wh.watched_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY m.id
       ORDER BY watch_count DESC, m.rating DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }

  static async getTopRated(limit = 20) {
    const [rows] = await db.query(
      'SELECT * FROM movies ORDER BY rating DESC LIMIT ?',
      [limit]
    );
    return rows;
  }

  static async getNewReleases(limit = 20) {
    const [rows] = await db.query(
      'SELECT * FROM movies ORDER BY release_year DESC, created_at DESC LIMIT ?',
      [limit]
    );
    return rows;
  }

  static async getByGenre(genre, limit = 20) {
    const [rows] = await db.query(
      'SELECT * FROM movies WHERE FIND_IN_SET(?, genre) > 0 ORDER BY rating DESC LIMIT ?',
      [genre, limit]
    );
    return rows;
  }

  static async getByType(type, limit = 60) {
    const [rows] = await db.query(
      'SELECT * FROM movies WHERE type = ? ORDER BY rating DESC LIMIT ?',
      [type, limit]
    );
    return rows;
  }

  static async getSimilar(movieId, genre, limit = 8) {
    const firstGenre = genre.split(',')[0].trim();
    const [rows] = await db.query(
      `SELECT * FROM movies
       WHERE FIND_IN_SET(?, genre) > 0 AND id != ?
       ORDER BY rating DESC LIMIT ?`,
      [firstGenre, movieId, limit]
    );
    return rows;
  }

  static async search(query, limit = 50) {
    const like = `%${query}%`;
    const [rows] = await db.query(
      `SELECT * FROM movies
       WHERE title LIKE ? OR description LIKE ? OR cast_members LIKE ? OR genre LIKE ?
       ORDER BY rating DESC LIMIT ?`,
      [like, like, like, like, limit]
    );
    return rows;
  }

  /* ── Genres ─────────────────────────────── */
  static async getGenres() {
    const [rows] = await db.query(
      "SELECT DISTINCT genre FROM movies WHERE genre IS NOT NULL AND genre != ''"
    );
    const genres = new Set();
    rows.forEach(r => r.genre.split(',').forEach(g => genres.add(g.trim())));
    return [...genres].filter(Boolean).sort();
  }

  /* ── CRUD ───────────────────────────────── */
  static async create(data) {
    const {
      title, description, genre, release_year, duration,
      rating, thumbnail, banner, video_url,
      cast_members, director, type, featured
    } = data;

    const [result] = await db.query(
      `INSERT INTO movies
         (title, description, genre, release_year, duration, rating,
          thumbnail, banner, video_url, cast_members, director, type, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, genre, release_year, duration, rating,
       thumbnail, banner, video_url, cast_members, director, type, featured ? 1 : 0]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const {
      title, description, genre, release_year, duration,
      rating, thumbnail, banner, video_url,
      cast_members, director, type, featured
    } = data;

    await db.query(
      `UPDATE movies SET
         title=?, description=?, genre=?, release_year=?, duration=?,
         rating=?, thumbnail=?, banner=?, video_url=?,
         cast_members=?, director=?, type=?, featured=?
       WHERE id=?`,
      [title, description, genre, release_year, duration,
       rating, thumbnail, banner, video_url,
       cast_members, director, type, featured ? 1 : 0, id]
    );
  }

  static async delete(id) {
    await db.query('DELETE FROM movies WHERE id = ?', [id]);
  }

  /* ── Stats ──────────────────────────────── */
  static async count() {
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM movies');
    return total;
  }

  static async getRecent(limit = 5) {
    const [rows] = await db.query(
      'SELECT * FROM movies ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return rows;
  }
}

module.exports = Movie;
