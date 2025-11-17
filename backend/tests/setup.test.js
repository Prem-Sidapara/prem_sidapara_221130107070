const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
require('dotenv').config();

describe('xts', () => {
  let mysqlConnection;
  
  test('MySQL connection should work', async () => {
    mysqlConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    expect(mysqlConnection).toBeDefined();
    
    const [rows] = await mysqlConnection.execute('SELECT 1 + 1 AS result');
    expect(rows[0].result).toBe(2);
  });

  test('MySQL tables should exist', async () => {
    const [users] = await mysqlConnection.execute('SELECT COUNT(*) as count FROM users');
    expect(users[0].count).toBeGreaterThan(0);
    
    const [tables] = await mysqlConnection.execute(
      "SHOW TABLES LIKE 'orders'"
    );
    expect(tables.length).toBe(1);
    
    const [orderItems] = await mysqlConnection.execute(
      "SHOW TABLES LIKE 'order_items'"
    );
    expect(orderItems.length).toBe(1);
  });

  test('MongoDB connection should work', async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    expect(mongoose.connection.readyState).toBe(1);
  });

  test('MongoDB products collection should exist with data', async () => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: 'products' }).toArray();
    expect(collections.length).toBe(1);
    
    const productsCount = await db.collection('products').countDocuments();
    expect(productsCount).toBeGreaterThan(0);
  });

  test('Environment variables should be set', () => {
    expect(process.env.DB_HOST).toBeDefined();
    expect(process.env.DB_USER).toBeDefined();
    expect(process.env.DB_PASSWORD).toBeDefined();
    expect(process.env.DB_NAME).toBeDefined();
    expect(process.env.MONGODB_URI).toBeDefined();
    expect(process.env.JWT_SECRET).toBeDefined();
  });

  afterAll(async () => {
    if (mysqlConnection) await mysqlConnection.end();
    await mongoose.connection.close();
  });
});