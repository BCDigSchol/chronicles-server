const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Genre of Publication Endpoints', () => {

  let token = '';
  let createdGenreId = 1;
  let createdPublicationId = 1;

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'chroniclesowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
    const genreResponse = await supertest(app).post('/api/genres/')
      .set('Authorization', `${token}`)
      .send({
        genre: 'Test Genre',
        notes: ''
      });
    createdGenreId = genreResponse.body.id;
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
    await requestWithSupertest.delete('/api/genres/' + createdGenreId.toString())
      .set('Authorization', `${token}`);
    await requestWithSupertest.delete('/api/publications/' + createdPublicationId.toString())
      .set('Authorization', `${token}`);
  });

  it('CREATE /api/genres-of-publications should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/genres-of-publications')
      .set('Authorization', `${token}`)
      .send({
        genreId: createdGenreId,
        publicationId: createdPublicationId,
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('genreId');
    expect(res.body).toHaveProperty('publicationId');
  });

  it('CREATE /api/genres-of-publications should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/genres-of-publications')
      .send({
        genreId: createdGenreId,
        publicationId: createdPublicationId,
        notes: ''
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/genres-of-publications should reject items without publicationId', async () => {
    const res = await requestWithSupertest
      .post('/api/genres-of-publications')
      .set('Authorization', `${token}`)
      .send({
        genreId: createdGenreId,
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('CREATE /api/genres-of-publications should reject items without genreId', async () => {
    const res = await requestWithSupertest
      .post('/api/genres-of-publications')
      .set('Authorization', `${token}`)
      .send({
        publicationId: createdPublicationId,
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('GET /api/genres-of-publications should show all genres-of-publications', async () => {
    const res = await requestWithSupertest.get('/api/genres-of-publications')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/genres-of-publications?page=1&size=5 should show paginated genres-of-publications', async () => {
    const res = await requestWithSupertest.get('/api/genres-of-publications?page=0&size=5')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/genres-of-publications/:publicationId/:genreId should return a single item in full detail', async () => {
    const res = await requestWithSupertest.get('/api/genres-of-publications/' + createdPublicationId.toString() + '/' + createdGenreId.toString() + '/')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('publicationId');
    expect(res.body).toHaveProperty('genreId');
    expect(res.body.genre).toBeInstanceOf(Object);
    expect(res.body.publication).toBeInstanceOf(Object);
    expect(res.body.publication.authors).toBeInstanceOf(Array);
    expect(res.body.publication.narrations).toBeInstanceOf(Array);
  });

  it('UPDATE /api/genres-of-publications/:publicationId/:genreId should update a single enry', async () => {
    const res = await requestWithSupertest.put('/api/genres-of-publications/' + createdPublicationId.toString() + '/' + createdGenreId.toString() + '/')
      .set('Authorization', `${token}`)
      .send({
        publicationId: createdPublicationId,
        genreId: createdGenreId,
        notes: 'Updated notes'
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'GenreOfPublication was updated successfully.');
  });

  it('UPDATE /api/genres-of-publications/:publicationId/:genreId should update reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/genres-of-publications/' + createdPublicationId.toString() + '/' + createdGenreId.toString() + '/')
      .send({
        publicationId: createdPublicationId,
        genreId: createdGenreId,
        notes: 'Updated notes'
      });
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/genres-of-publications/:publicationId/:genreId should delete a single genre-of-publication', async () => {
    const res = await requestWithSupertest.delete('/api/genres-of-publications/' + createdPublicationId.toString() + '/' + createdGenreId.toString() + '/')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'GenreOfPublication was deleted successfully!');
  });

  it('DELETE /api/genres-of-publications/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/genres-of-publications/' + createdPublicationId.toString() + '/' + createdGenreId.toString() + '/');
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/genres-of-publications/ should delete all items', async () => {
    const res = await requestWithSupertest.delete('/api/genres-of-publications/')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.message).toMatch(/\d+ GenresOfPublications were deleted successfully!/);
  });

  it('DELETE /api/genres-of-publications/ should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/genres-of-publications/');
    expect(res.status).toEqual(401);
  });

});