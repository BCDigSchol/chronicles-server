const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Export Endpoints', () => {

  let token = '';

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'chroniclesowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('GET /api/export should show all export data', async () => {
    const res = await requestWithSupertest.get('/api/export')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.publications).toBeInstanceOf(Array);
    expect(res.body.authors).toBeInstanceOf(Array);
    expect(res.body.genres).toBeInstanceOf(Array);
    expect(res.body.narrations).toBeInstanceOf(Array);
    expect(res.body.authorsOfPublications).toBeInstanceOf(Array);
    expect(res.body.genresOfPublications).toBeInstanceOf(Array);
    expect(res.body.narrationsOfPublications).toBeInstanceOf(Array);
  });

  it('GET /api/export should reject a request without proper authorization', async () => {
    const res = await requestWithSupertest.get('/api/export');
    expect(res.status).toEqual(401);
  });
  
});