const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Profile Endpoints', () => {

  let token = '';
  let createdId = 1;

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'icamowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('GET /api/profile should show all profile data', async () => {
    const requestString = process.env.OWNER_USERNAME !== undefined ? process.env.OWNER_USERNAME : 'icamowner';
    const res = await requestWithSupertest.get('/api/profile/' + requestString)
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('data');
  });

  it('GET /api/profile should reject a request without proper authorization', async () => {
    const requestString = process.env.OWNER_USERNAME !== undefined ? process.env.OWNER_USERNAME : 'icamowner';
    const res = await requestWithSupertest.get('/api/profile/' + requestString);
    expect(res.status).toEqual(401);
  });
  
});