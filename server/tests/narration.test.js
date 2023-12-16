const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Narration Endpoints', () => {

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

  it('CREATE /api/narrations should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/narrations')
      .set('Authorization', `${token}`)
      .send({
        narration: 'Test Narration',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('narration');
    createdId = res.body.id;
  });

  it('CREATE /api/narrations should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/narrations')
      .send({
        narration: 'Test Narration',
        notes: ''
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/narrations should reject items without titles', async () => {
    const res = await requestWithSupertest
      .post('/api/narrations')
      .set('Authorization', `${token}`)
      .send({
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('GET /api/narrations should show all narrations', async () => {
    const res = await requestWithSupertest.get('/api/narrations');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/narrations?page=1&size=5 should show paginated narrations', async () => {
    const res = await requestWithSupertest.get('/api/narrations?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/narrations?page=1&size=5&narration=xyz should filter by narration', async () => {
    const res = await requestWithSupertest.get('/api/narrations?page=0&size=5&narration=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/narrations/:id should return a single narration in full detail', async () => {
    const res = await requestWithSupertest.get('/api/narrations/' + createdId.toString());
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('narration');
    expect(res.body.publications).toBeInstanceOf(Array);
  });

  it('UPDATE /api/narrations/:id should update a single narration', async () => {
    const res = await requestWithSupertest.put('/api/narrations/' + createdId.toString())
      .set('Authorization', `${token}`)
      .send({
        id: createdId,
        title: 'Test Narration Updated',
        notes: 'Updated'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'Narration was updated successfully.');
  });

  it('UPDATE /api/narrations/:id should update reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/narrations/' + createdId.toString())
      .send({
        id: createdId,
        title: 'Test Narration Updated',
        notes: 'Updated'
      });
    expect(res.status).toEqual(401);
  });

  it('UPDATE /api/narrations/:id should update reject request without id field', async () => {
    const res = await requestWithSupertest.put('/api/narrations/' + createdId.toString())
      .send({
        title: 'Test Narration Updated',
        notes: 'Updated'
      });
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/narrations/:id should delete a single narration', async () => {
    const res = await requestWithSupertest.delete('/api/narrations/' + createdId.toString())
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'Narration was deleted successfully!');
  });

  it('DELETE /api/narrations/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/narrations/' + createdId.toString());
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/narrations should delete all narrations', async () => {
    const res = await requestWithSupertest.delete('/api/narrations')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.message).toMatch(/\d+ Narrations were deleted successfully!/);
  });

  it('DELETE /api/narrations should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/narrations');
    expect(res.status).toEqual(401);
  });
  
});