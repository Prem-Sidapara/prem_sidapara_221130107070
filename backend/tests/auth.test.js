const request = require('supertest');
const app = require('../server');

describe('Authentication API', () => {
  let authToken;
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'test123456'
  };

  test('POST /api/auth/register - should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user.name).toBe(testUser.name);
    expect(response.body.user.role).toBe('customer');
  });

  test('POST /api/auth/register - should reject duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(400);
  });

  test('POST /api/auth/login - should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(testUser.email);
    authToken = response.body.token;
  });

  test('POST /api/auth/login - should reject invalid credentials', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      })
      .expect(401);
  });

  test('GET /api/auth/profile - should get user profile with valid token', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.user.email).toBe(testUser.email);
  });

  test('GET /api/auth/profile - should reject without token', async () => {
    await request(app)
      .get('/api/auth/profile')
      .expect(401);
  });
});