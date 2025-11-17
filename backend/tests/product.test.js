const request = require('supertest');
const app = require('../server');

describe('Product Sorting API', () => {
  test('GET /api/products - should return products sorted by price descending by default', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    
    // Check if sorted by price descending
    const products = response.body.data;
    if (products.length > 1) {
      for (let i = 0; i < products.length - 1; i++) {
        expect(products[i].price).toBeGreaterThanOrEqual(products[i + 1].price);
      }
    }
  });

  test('GET /api/products?sort=asc - should return products sorted by price ascending', async () => {
    const response = await request(app)
      .get('/api/products?sort=asc')
      .expect(200);

    const products = response.body.data;
    if (products.length > 1) {
      for (let i = 0; i < products.length - 1; i++) {
        expect(products[i].price).toBeLessThanOrEqual(products[i + 1].price);
      }
    }
  });

  test('GET /api/products with x-sort-order header - should change sort order', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('x-sort-order', 'asc')
      .expect(200);

    const products = response.body.data;
    if (products.length > 1) {
      for (let i = 0; i < products.length - 1; i++) {
        expect(products[i].price).toBeLessThanOrEqual(products[i + 1].price);
      }
    }
  });
});