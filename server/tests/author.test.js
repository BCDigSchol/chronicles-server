const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Author Endpoints', () => {

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

  it('CREATE /api/authors should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/authors')
      .set('Authorization', `${token}`)
      .send({
        surname: 'Test',
        otherNames: 'Test',
        gender: 'Male',
        nationality: 'British',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('surname');
    expect(res.body).toHaveProperty('otherNames');
    expect(res.body).toHaveProperty('gender');
    expect(res.body).toHaveProperty('nationality');
    createdId = res.body.id;
  });

  it('CREATE /api/authors should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/authors')
      .send({
        surname: 'Test',
        otherNames: 'Test',
        gender: 'Male',
        nationality: 'British',
        notes: ''
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/authors should reject items without surnames', async () => {
    const res = await requestWithSupertest
      .post('/api/authors')
      .set('Authorization', `${token}`)
      .send({
        otherNames: 'Test',
        gender: 'Male',
        nationality: 'British',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('CREATE /api/authors should reject items without gender', async () => {
    const res = await requestWithSupertest
      .post('/api/authors')
      .set('Authorization', `${token}`)
      .send({
        surname: 'Test',
        otherNames: 'Test',
        nationality: 'British',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('CREATE /api/authors should reject items without nationality', async () => {
    const res = await requestWithSupertest
      .post('/api/authors')
      .set('Authorization', `${token}`)
      .send({
        surname: 'Test',
        otherNames: 'Test',
        gender: 'Male',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('GET /api/authors should show all authors', async () => {
    const res = await requestWithSupertest.get('/api/authors');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/authors?page=1&size=5 should show paginated authors', async () => {
    const res = await requestWithSupertest.get('/api/authors?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/authors?page=1&size=5&surname=xyz should filter by surname', async () => {
    const res = await requestWithSupertest.get('/api/authors?page=0&size=5&surname=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/authors?page=1&size=5&maidenName=xyz should filter by maiden name', async () => {
    const res = await requestWithSupertest.get('/api/authors?page=0&size=5&maidenName=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/authors?page=1&size=5&otherNames=xyz should filter by other names', async () => {
    const res = await requestWithSupertest.get('/api/authors?page=0&size=5&otherNames=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/authors?page=1&size=5&label=xyz should filter by label', async () => {
    const res = await requestWithSupertest.get('/api/authors?page=0&size=5&label=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/authors?page=1&size=5&label=xyz should filter by gender', async () => {
    const res = await requestWithSupertest.get('/api/authors?page=0&size=5&gender=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/authors?page=1&size=5&nationality=xyz should filter by nationality', async () => {
    const res = await requestWithSupertest.get('/api/authors?page=0&size=5&nationality=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/authors?page=1&size=5&label=xyz should filter by specific nationality', async () => {
    const res = await requestWithSupertest.get('/api/authors?page=0&size=5&specificNationality=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/authors/:id should return a single author in full detail', async () => {
    const res = await requestWithSupertest.get('/api/authors/' + createdId.toString());
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('surname');
    expect(res.body).toHaveProperty('gender');
    expect(res.body).toHaveProperty('nationality');
    expect(res.body.publications).toBeInstanceOf(Array);
  });

  it('UPDATE /api/authors/:id should update a single author', async () => {
    const res = await requestWithSupertest.put('/api/authors/' + createdId.toString())
      .set('Authorization', `${token}`)
      .send({
        id: createdId,
        surname: 'Updated Test',
        otherNames: 'Updated Test',
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'Author was updated successfully.');
  });

  it('UPDATE /api/authors/:id should update reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/authors/' + createdId.toString())
      .send({
        id: createdId,
        surname: 'Updated Test',
        otherNames: 'Updated Test',
      });
    expect(res.status).toEqual(401);
  });

  it('UPDATE /api/authors/:id should update reject request without id field', async () => {
    const res = await requestWithSupertest.put('/api/authors/' + createdId.toString())
      .send({
        surname: 'Updated Test',
        otherNames: 'Updated Test',
      });
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/authors/:id should delete a single author', async () => {
    const res = await requestWithSupertest.delete('/api/authors/' + createdId.toString())
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'Author was deleted successfully!');
  });

  it('DELETE /api/authors/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/authors/' + createdId.toString());
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/authors should delete all authors', async () => {
    const res = await requestWithSupertest.delete('/api/authors')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.message).toMatch(/\d+ Authors were deleted successfully!/);
  });

  it('DELETE /api/authors should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/authors');
    expect(res.status).toEqual(401);
  });
  
});