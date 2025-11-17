const db = require('../config/db');

const OrderModel = {
  // Create new order
  create: async (userId, total) => {
    const [result] = await db.execute(
      'INSERT INTO orders (userId, total) VALUES (?, ?)',
      [userId, total]
    );
    return result.insertId;
  },

  // Add order items
  addItems: async (orderId, items) => {
    const values = items.map(item => [
      orderId,
      item.productId,
      item.quantity,
      item.priceAtPurchase
    ]);
    
    await db.query(
      'INSERT INTO order_items (orderId, productId, quantity, priceAtPurchase) VALUES ?',
      [values]
    );
  },

  // Get user orders
  getUserOrders: async (userId) => {
    const [orders] = await db.execute(
      `SELECT o.id, o.total, o.createdAt,
              oi.productId, oi.quantity, oi.priceAtPurchase
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.orderId
       WHERE o.userId = ?
       ORDER BY o.createdAt DESC`,
      [userId]
    );
    return orders;
  },

  // Get daily revenue (for reports)
  getDailyRevenue: async () => {
    const [rows] = await db.execute(
      `SELECT DATE(createdAt) as date, SUM(total) as revenue
       FROM orders
       GROUP BY DATE(createdAt)
       ORDER BY date DESC
       LIMIT 30`
    );
    return rows;
  },

  // Get top customers (for reports)
  getTopCustomers: async (limit = 10) => {
    const [rows] = await db.execute(
      `SELECT u.name, u.email, COUNT(o.id) as orderCount, SUM(o.total) as totalSpent
       FROM users u
       INNER JOIN orders o ON u.id = o.userId
       GROUP BY u.id
       ORDER BY totalSpent DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }
};

module.exports = OrderModel;