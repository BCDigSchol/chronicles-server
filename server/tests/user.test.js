const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('User Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('GET /api/user should show all users', async () => {
    const res = await requestWithSupertest.get('/api/user')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/user?page=1&size=5 should show paginated users', async () => {
    const res = await requestWithSupertest.get('/api/user?page=0&size=5')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/user?page=1&size=5&title=xyz should filter by username', async () => {
    const res = await requestWithSupertest.get('/api/user?page=0&size=5&username=xyz')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/user should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.get('/api/user');
    expect(res.status).toEqual(401);
  });

  it('POST /api/user should log a user in', async () => {
    const username = process.env.OWNER_USERNAME !== undefined ? process.env.OWNER_USERNAME : 'icamowner';
    const password = process.env.OWNER_PASSWORD !== undefined ? process.env.OWNER_PASSWORD : 'password';
    const res = await requestWithSupertest.post('/api/user/login')
      .send({
        username: username,
        password: password
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('data');
  });

  it('POST /api/user/login should reject an improper user login', async () => {
    const username = process.env.OWNER_USERNAME !== undefined ? process.env.OWNER_USERNAME : 'icamowner';
    const password = 'xyz';
    const res = await requestWithSupertest.post('/api/user/login')
      .send({
        username: username,
        password: password
      });
    expect(res.body.status).toEqual(0);
  });

  it('POST /api/user/register should register a user', async () => {
    const res = await requestWithSupertest.post('/api/user/register')
      .send({
        username: 'TestUser',
        password: 'password',
        email: 'sample@gmail.com'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('POST /api/user/register should reject a request without a username', async () => {
    const res = await requestWithSupertest.post('/api/user/register')
      .send({
        password: 'password',
        email: 'sample@gmail.com'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'Must contain a \'username\'!');
  });

  it('POST /api/user/register should reject a request without a password', async () => {
    const res = await requestWithSupertest.post('/api/user/register')
      .send({
        username: 'TestUser',
        email: 'sample@gmail.com'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'Must contain a \'password\'!');
  });

  it('POST /api/user/register should reject a request without a email', async () => {
    const res = await requestWithSupertest.post('/api/user/register')
      .send({
        username: 'TestUser',
        password: 'password'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'Must contain an \'email\'!');
  });

  it('PUT /api/user/:username should update a user\'s email', async () => {
    const res = await requestWithSupertest.put('/api/user/TestUser')
      .set('Authorization', `${token}`)
      .send({
        username: 'TestUser',
        email: 'updated_sample@gmail.com'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'User was updated successfully.');
  });

  it('PUT /api/user/:username should update a user\'s role', async () => {
    const res = await requestWithSupertest.put('/api/user/TestUser')
      .set('Authorization', `${token}`)
      .send({
        username: 'TestUser',
        role: 'Editor'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'User was updated successfully.');
  });

  it('PUT /api/user/:username should reject unauthorized request', async () => {
    const res = await requestWithSupertest.put('/api/user/TestUser')
      .send({
        username: 'TestUser',
        email: 'updated_sample@gmail.com'
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });
  
});