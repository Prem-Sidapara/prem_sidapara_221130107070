const db = require('../config/db');
const bcrypt = require('bcryptjs');

const UserModel = {
  // Create new user
  create: async (name, email, password, role = 'customer') => {
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, passwordHash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );
    return result.insertId;
  },

  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, createdAt FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  // Verify password
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = UserModel;