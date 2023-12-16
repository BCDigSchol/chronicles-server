const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Genre Endpoints', () => {

  let token = '';
  let createdId = 1;

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'chroniclesowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
  });

  it('CREATE /api/genres should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/genres')
      .set('Authorization', `${token}`)
      .send({
        genre: 'Test Genre',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('genre');
    createdId = res.body.id;
  });

  it('CREATE /api/genres should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/genres')
      .send({
        genre: 'Test Genre',
        notes: ''
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/genres should reject items without titles', async () => {
    const res = await requestWithSupertest
      .post('/api/genres')
      .set('Authorization', `${token}`)
      .send({
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('GET /api/genres should show all genres', async () => {
    const res = await requestWithSupertest.get('/api/genres');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/genres?page=1&size=5 should show paginated genres', async () => {
    const res = await requestWithSupertest.get('/api/genres?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/genres?page=1&size=5&genre=xyz should filter by genre', async () => {
    const res = await requestWithSupertest.get('/api/genres?page=0&size=5&genre=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/genres/:id should return a single genre in full detail', async () => {
    const res = await requestWithSupertest.get('/api/genres/' + createdId.toString());
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('genre');
    expect(res.body.publications).toBeInstanceOf(Array);
  });

  it('UPDATE /api/genres/:id should update a single genre', async () => {
    const res = await requestWithSupertest.put('/api/genres/' + createdId.toString())
      .set('Authorization', `${token}`)
      .send({
        id: createdId,
        title: 'Test Genre Updated',
        notes: 'Updated'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'Genre was updated successfully.');
  });

  it('UPDATE /api/genres/:id should update reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/genres/' + createdId.toString())
      .send({
        id: createdId,
        title: 'Test Genre Updated',
        notes: 'Updated'
      });
    expect(res.status).toEqual(401);
  });

  it('UPDATE /api/genres/:id should update reject request without id field', async () => {
    const res = await requestWithSupertest.put('/api/genres/' + createdId.toString())
      .send({
        title: 'Test Genre Updated',
        notes: 'Updated'
      });
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/genres/:id should delete a single genre', async () => {
    const res = await requestWithSupertest.delete('/api/genres/' + createdId.toString())
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'Genre was deleted successfully!');
  });

  it('DELETE /api/genres/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/genres/' + createdId.toString());
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/genres should delete all genres', async () => {
    const res = await requestWithSupertest.delete('/api/genres')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.message).toMatch(/\d+ Genres were deleted successfully!/);
  });

  it('DELETE /api/genres should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/genres');
    expect(res.status).toEqual(401);
  });
  
});