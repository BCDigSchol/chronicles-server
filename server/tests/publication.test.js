const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Publication Endpoints', () => {

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

  it('CREATE /api/publications should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/publications')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        settingName: 'Test Setting',
        settingCategory: 'Family Home',
        period: 'Contemporary/Unspecified',
        timeScale: 'Months',
        protagonistCategory: 'Individual',
        protagonistGroupType: 'Family',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('settingName');
    expect(res.body).toHaveProperty('settingCategory');
    expect(res.body).toHaveProperty('period');
    expect(res.body).toHaveProperty('timeScale');
    expect(res.body).toHaveProperty('protagonistCategory');
    expect(res.body).toHaveProperty('protagonistGroupType');
    createdId = res.body.id;
  });

  it('CREATE /api/publications should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/publications')
      .send({
        title: 'Test Title',
        settingName: 'Test Setting',
        settingCategory: 'Family Home',
        period: 'Contemporary/Unspecified',
        timeScale: 'Months',
        protagonistCategory: 'Individual',
        protagonistGroupType: 'Family',
        notes: ''
      });
    expect(res.status).toEqual(401);
  });

  it('CREATE /api/publications should reject items without title', async () => {
    const res = await requestWithSupertest
      .post('/api/publications')
      .set('Authorization', `${token}`)
      .send({
        settingName: 'Test Setting',
        settingCategory: 'Family Home',
        period: 'Contemporary/Unspecified',
        timeScale: 'Months',
        protagonistCategory: 'Individual',
        protagonistGroupType: 'Family',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('CREATE /api/publications should reject items without setting category', async () => {
    const res = await requestWithSupertest
      .post('/api/publications')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        settingName: 'Test Setting',
        period: 'Contemporary/Unspecified',
        timeScale: 'Months',
        protagonistCategory: 'Individual',
        protagonistGroupType: 'Family',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('CREATE /api/publications should reject items without period', async () => {
    const res = await requestWithSupertest
      .post('/api/publications')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        settingName: 'Test Setting',
        settingCategory: 'Family Home',
        timeScale: 'Months',
        protagonistCategory: 'Individual',
        protagonistGroupType: 'Family',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('CREATE /api/publications should reject items without time scale', async () => {
    const res = await requestWithSupertest
      .post('/api/publications')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        settingName: 'Test Setting',
        settingCategory: 'Family Home',
        period: 'Contemporary/Unspecified',
        protagonistCategory: 'Individual',
        protagonistGroupType: 'Family',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('CREATE /api/publications should reject items without protagonist category', async () => {
    const res = await requestWithSupertest
      .post('/api/publications')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        settingName: 'Test Setting',
        settingCategory: 'Family Home',
        period: 'Contemporary/Unspecified',
        timeScale: 'Months',
        protagonistGroupType: 'Family',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('CREATE /api/publications should reject items without protagonist group type', async () => {
    const res = await requestWithSupertest
      .post('/api/publications')
      .set('Authorization', `${token}`)
      .send({
        title: 'Test Title',
        settingName: 'Test Setting',
        settingCategory: 'Family Home',
        period: 'Contemporary/Unspecified',
        timeScale: 'Months',
        protagonistCategory: 'Individual',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('GET /api/publications should show all publications', async () => {
    const res = await requestWithSupertest.get('/api/publications');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/publications?page=1&size=5 should show paginated publications', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/publications?page=1&size=5&title=xyz should filter by title', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5&title=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/publications?page=1&size=5&subtitle=xyz should filter by subtitle', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5&subtitle=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/publications?page=1&size=5&settingName=xyz should filter by setting name', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5&settingName=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/publications?page=1&size=5&settingCategory=xyz should filter by setting category', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5&settingCategory=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/publications?page=1&size=5&period=xyz should filter by period', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5&period=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/publications?page=1&size=5&timeScale=xyz should filter by time scale', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5&timeScale=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/publications?page=1&size=5&protagonistCategory=xyz should filter by protagonist category', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5&protagonistCategory=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/publications?page=1&size=5&protagonistGroupType=xyz should filter by protagonist group type', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5&protagonistGroupType=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/publications?page=1&size=5&genre=xyz should filter by genre', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5&genre=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/publications?page=1&size=5&narration=xyz should filter by narration', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5&narration=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/publications?page=1&size=5&author=xyz should filter by author', async () => {
    const res = await requestWithSupertest.get('/api/publications?page=0&size=5&author=xyz');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/publications/:id should return a single publication in full detail', async () => {
    const res = await requestWithSupertest.get('/api/publications/' + createdId.toString());
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('subtitle');
    expect(res.body).toHaveProperty('settingName');
    expect(res.body).toHaveProperty('settingCategory');
    expect(res.body).toHaveProperty('period');
    expect(res.body).toHaveProperty('timeScale');
    expect(res.body).toHaveProperty('protagonistCategory');
    expect(res.body).toHaveProperty('protagonistGroupType');
    expect(res.body.authors).toBeInstanceOf(Array);
    expect(res.body.genres).toBeInstanceOf(Array);
    expect(res.body.narrations).toBeInstanceOf(Array);
  });

  it('UPDATE /api/publications/:id should update a single publication', async () => {
    const res = await requestWithSupertest.put('/api/publications/' + createdId.toString())
      .set('Authorization', `${token}`)
      .send({
        id: createdId,
        title: 'Updated Test Title'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'Publication was updated successfully.');
  });

  it('UPDATE /api/publications/:id should update reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/publications/' + createdId.toString())
      .send({
        id: createdId,
        title: 'Updated Test Title'
      });
    expect(res.status).toEqual(401);
  });

  it('UPDATE /api/publications/:id should update reject request without id field', async () => {
    const res = await requestWithSupertest.put('/api/publications/' + createdId.toString())
      .send({
        title: 'Updated Test Title'
      });
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/publications/:id should delete a single publication', async () => {
    const res = await requestWithSupertest.delete('/api/publications/' + createdId.toString())
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'Publication was deleted successfully!');
  });

  it('DELETE /api/publications/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/publications/' + createdId.toString());
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/publications should delete all publications', async () => {
    const res = await requestWithSupertest.delete('/api/publications')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.message).toMatch(/\d+ Publications were deleted successfully!/);
  });

  it('DELETE /api/publications should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/publications');
    expect(res.status).toEqual(401);
  });
  
});