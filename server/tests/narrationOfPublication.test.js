const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Narration of Publication Endpoints', () => {

  let token = '';
  let createdNarrationId = 1;
  let createdPublicationId = 1;

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'chroniclesowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
    const narrationResponse = await supertest(app).post('/api/narrations/')
      .set('Authorization', `${token}`)
      .send({
        narration: 'Test Narration',
        notes: ''
      });
    createdNarrationId = narrationResponse.body.id;
    const publicationResponse = await supertest(app).post('/api/publications/')
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
    createdPublicationId = publicationResponse.body.id;
  });

  afterAll(async () => {
    await requestWithSupertest.delete('/api/narrations/' + createdNarrationId.toString())
      .set('Authorization', `${token}`);
    await requestWithSupertest.delete('/api/publications/' + createdPublicationId.toString())
      .set('Authorization', `${token}`);
  });

  it('CREATE /api/narrations-of-publications should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/narrations-of-publications')
      .set('Authorization', `${token}`)
      .send({
        narrationId: createdNarrationId,
        publicationId: createdPublicationId,
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('narrationId');
    expect(res.body).toHaveProperty('publicationId');
  });

  it('CREATE /api/narrations-of-publications should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/narrations-of-publications')
      .send({
        narrationId: createdNarrationId,
        publicationId: createdPublicationId,
        notes: ''
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/narrations-of-publications should reject items without publicationId', async () => {
    const res = await requestWithSupertest
      .post('/api/narrations-of-publications')
      .set('Authorization', `${token}`)
      .send({
        narrationId: createdNarrationId,
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('CREATE /api/narrations-of-publications should reject items without narrationId', async () => {
    const res = await requestWithSupertest
      .post('/api/narrations-of-publications')
      .set('Authorization', `${token}`)
      .send({
        publicationId: createdPublicationId,
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('GET /api/narrations-of-publications should show all narrations-of-publications', async () => {
    const res = await requestWithSupertest.get('/api/narrations-of-publications')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/narrations-of-publications?page=1&size=5 should show paginated narrations-of-publications', async () => {
    const res = await requestWithSupertest.get('/api/narrations-of-publications?page=0&size=5')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/narrations-of-publications/:publicationId/:narrationId should return a single item in full detail', async () => {
    const res = await requestWithSupertest.get('/api/narrations-of-publications/' + createdPublicationId.toString() + '/' + createdNarrationId.toString() + '/')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('publicationId');
    expect(res.body).toHaveProperty('narrationId');
    expect(res.body.narration).toBeInstanceOf(Object);
    expect(res.body.publication).toBeInstanceOf(Object);
    expect(res.body.publication.authors).toBeInstanceOf(Array);
    expect(res.body.publication.genres).toBeInstanceOf(Array);
  });

  it('UPDATE /api/narrations-of-publications/:publicationId/:narrationId should update a single enry', async () => {
    const res = await requestWithSupertest.put('/api/narrations-of-publications/' + createdPublicationId.toString() + '/' + createdNarrationId.toString() + '/')
      .set('Authorization', `${token}`)
      .send({
        publicationId: createdPublicationId,
        narrationId: createdNarrationId,
        notes: 'Updated notes'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'NarrationOfPublication was updated successfully.');
  });

  it('UPDATE /api/narrations-of-publications/:publicationId/:narrationId should update reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/narrations-of-publications/' + createdPublicationId.toString() + '/' + createdNarrationId.toString() + '/')
      .send({
        publicationId: createdPublicationId,
        narrationId: createdNarrationId,
        notes: 'Updated notes'
      });
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/narrations-of-publications/:publicationId/:narrationId should delete a single narration-of-publication', async () => {
    const res = await requestWithSupertest.delete('/api/narrations-of-publications/' + createdPublicationId.toString() + '/' + createdNarrationId.toString() + '/')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'NarrationOfPublication was deleted successfully!');
  });

  it('DELETE /api/narrations-of-publications/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/narrations-of-publications/' + createdPublicationId.toString() + '/' + createdNarrationId.toString() + '/');
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/narrations-of-publications/ should delete all items', async () => {
    const res = await requestWithSupertest.delete('/api/narrations-of-publications/')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.message).toMatch(/\d+ NarrationsOfPublications were deleted successfully!/);
  });

  it('DELETE /api/narrations-of-publications/ should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/narrations-of-publications/');
    expect(res.status).toEqual(401);
  });

});