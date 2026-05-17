'use strict';

const db     = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /* ── Finders ────────────────────────────── */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  }

  static async getAll() {
    const [rows] = await db.query(
      'SELECT id, name, email, plan, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  /* ── Create ─────────────────────────────── */
  static async create({ name, email, password, plan = 'standard' }) {
    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, plan, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, plan, 'user']
    );
    return result.insertId;
  }

  /* ── Auth ───────────────────────────────── */
  static async verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  }

  /* ── Update ─────────────────────────────── */
  static async update(id, { name, email }) {
    await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
  }

  static async updatePassword(id, password) {
    const hash = await bcrypt.hash(password, 12);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hash, id]);
  }

  /* ── Delete ─────────────────────────────── */
  static async delete(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
  }

  /* ── My List ─────────────────────────────── */
  static async addToList(userId, movieId) {
    await db.query(
      'INSERT IGNORE INTO user_list (user_id, movie_id) VALUES (?, ?)',
      [userId, movieId]
    );
  }

  static async removeFromList(userId, movieId) {
    await db.query(
      'DELETE FROM user_list WHERE user_id = ? AND movie_id = ?',
      [userId, movieId]
    );
  }

  static async getMyList(userId) {
    const [rows] = await db.query(
      `SELECT m.* FROM movies m
       JOIN user_list ul ON m.id = ul.movie_id
       WHERE ul.user_id = ?
       ORDER BY ul.added_at DESC`,
      [userId]
    );
    return rows;
  }

  static async isInList(userId, movieId) {
    const [rows] = await db.query(
      'SELECT 1 FROM user_list WHERE user_id = ? AND movie_id = ? LIMIT 1',
      [userId, movieId]
    );
    return rows.length > 0;
  }

  /* ── Watch History ───────────────────────── */
  static async addToHistory(userId, movieId) {
    await db.query(
      `INSERT INTO watch_history (user_id, movie_id, watched_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE watched_at = NOW()`,
      [userId, movieId]
    );
  }

  static async getHistory(userId, limit = 20) {
    const [rows] = await db.query(
      `SELECT m.*, wh.watched_at FROM movies m
       JOIN watch_history wh ON m.id = wh.movie_id
       WHERE wh.user_id = ?
       ORDER BY wh.watched_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  /* ── Counts ─────────────────────────────── */
  static async count() {
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM users');
    return total;
  }
}

module.exports = User;
