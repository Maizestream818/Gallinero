import { db } from '../config/db.js';

export const User = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async create(user) {
    const { fullName, email, password, avatar } = user;
    const [result] = await db.query(
      'INSERT INTO users (fullName, email, password, avatar) VALUES (?, ?, ?, ?)',
      [fullName, email, password, avatar]
    );
    return result.insertId;
  },

  async updateProfile(id, data) {
    const { fullName, email, avatar } = data;
    await db.query(
      'UPDATE users SET fullName = ?, email = ?, avatar = ? WHERE id = ?',
      [fullName, email, avatar, id]
    );
  }
};

