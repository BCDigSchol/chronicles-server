const app = require('../app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Author of Publication Endpoints', () => {

  let token = '';
  let createdAuthorId = 1;
  let createdPublicationId = 1;

  beforeAll(async () => {
    const response = await supertest(app).post('/api/user/login')
      .send({
        username: process.env.OWNER_USERNAME || 'chroniclesowner',
        password: process.env.OWNER_PASSWORD || 'password'
      });
    token = response.body.token;
    const authorResponse = await supertest(app).post('/api/authors/')
      .set('Authorization', `${token}`)
      .send({
        surname: 'Test Surname',
        otherNames: 'Test Other Names',
        gender: 'Male',
        nationality: 'British'
      });
    createdAuthorId = authorResponse.body.id;
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
    await requestWithSupertest.delete('/api/authors/' + createdAuthorId.toString())
      .set('Authorization', `${token}`);
    await requestWithSupertest.delete('/api/publications/' + createdPublicationId.toString())
      .set('Authorization', `${token}`);
  });

  it('CREATE /api/authors-of-publications should accept valid data', async () => {
    const res = await requestWithSupertest
      .post('/api/authors-of-publications')
      .set('Authorization', `${token}`)
      .send({
        authorId: createdAuthorId,
        publicationId: createdPublicationId,
        publishedHonorific: 'Test Honorific',
        publishedName: 'Test Name',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('authorId');
    expect(res.body).toHaveProperty('publicationId');
    expect(res.body).toHaveProperty('publishedHonorific');
    expect(res.body).toHaveProperty('publishedName');
  });

  it('CREATE /api/authors-of-publications should reject request without proper authorization', async () => {
    const res = await requestWithSupertest
      .post('/api/authors-of-publications')
      .send({
        authorId: createdAuthorId,
        publicationId: createdPublicationId,
        publishedHonoriffic: 'Test Honoriffic',
        publishedName: 'Test Name',
        notes: ''
      });
    expect(res.status).toEqual(401);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('CREATE /api/authors-of-publications should reject items without publicationId', async () => {
    const res = await requestWithSupertest
      .post('/api/authors-of-publications')
      .set('Authorization', `${token}`)
      .send({
        authorId: createdAuthorId,
        publishedHonoriffic: 'Test Honoriffic',
        publishedName: 'Test Name',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('CREATE /api/authors-of-publications should reject items without authorId', async () => {
    const res = await requestWithSupertest
      .post('/api/authors-of-publications')
      .set('Authorization', `${token}`)
      .send({
        publicationId: createdPublicationId,
        publishedHonoriffic: 'Test Honoriffic',
        publishedName: 'Test Name',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('status', 0);
  });

  it('GET /api/authors-of-publications should show all authors-of-publications', async () => {
    const res = await requestWithSupertest.get('/api/authors-of-publications')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/authors-of-publications?page=1&size=5 should show paginated authors-of-publications', async () => {
    const res = await requestWithSupertest.get('/api/authors-of-publications?page=0&size=5')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/authors-of-publications?page=1&size=5&publishedName=xyz should filter by published name', async () => {
    const res = await requestWithSupertest.get('/api/authors-of-publications?page=0&size=5&publishedName=xyz')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.rows.length).toBe(0);
  });

  it('GET /api/authors-of-publications/:publicationId/:authorId should return a single item in full detail', async () => {
    const res = await requestWithSupertest.get('/api/authors-of-publications/' + createdPublicationId.toString() + '/' + createdAuthorId.toString() + '/')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('publicationId');
    expect(res.body).toHaveProperty('authorId');
    expect(res.body).toHaveProperty('publishedName');
    expect(res.body).toHaveProperty('publishedHonorific');
    expect(res.body.author).toBeInstanceOf(Object);
    expect(res.body.publication).toBeInstanceOf(Object);
    expect(res.body.publication.genres).toBeInstanceOf(Array);
    expect(res.body.publication.narrations).toBeInstanceOf(Array);
  });

  it('UPDATE /api/authors-of-publications/:publicationId/:authorId should update a single enry', async () => {
    const res = await requestWithSupertest.put('/api/authors-of-publications/' + createdPublicationId.toString() + '/' + createdAuthorId.toString() + '/')
      .set('Authorization', `${token}`)
      .send({
        publicationId: createdPublicationId,
        authorId: createdAuthorId,
        publishedHonoriffic: 'Updated Test Honoriffic',
        publishedName: 'Updated Test Name',
        notes: ''
      });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'AuthorOfPublication was updated successfully.');
  });

  it('UPDATE /api/authors-of-publications/:publicationId/:authorId should update reject request without proper authorization', async () => {
    const res = await requestWithSupertest.put('/api/authors-of-publications/' + createdPublicationId.toString() + '/' + createdAuthorId.toString() + '/')
      .send({
        publishedHonoriffic: 'Updated Test Honoriffic',
        publishedName: 'Updated Test Name',
        notes: ''
      });
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/authors-of-publications/:publicationId/:authorId should delete a single author-of-publication', async () => {
    const res = await requestWithSupertest.delete('/api/authors-of-publications/' + createdPublicationId.toString() + '/' + createdAuthorId.toString() + '/')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toHaveProperty('message', 'AuthorOfPublication was deleted successfully!');
  });

  it('DELETE /api/authors-of-publications/:id should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/authors-of-publications/' + createdPublicationId.toString() + '/' + createdAuthorId.toString() + '/');
    expect(res.status).toEqual(401);
  });

  it('DELETE /api/authors-of-publications/ should delete all items', async () => {
    const res = await requestWithSupertest.delete('/api/authors-of-publications/')
      .set('Authorization', `${token}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body.message).toMatch(/\d+ AuthorsOfPublications were deleted successfully!/);
  });

  it('DELETE /api/authors-of-publications/ should reject request without proper authorization', async () => {
    const res = await requestWithSupertest.delete('/api/authors-of-publications/');
    expect(res.status).toEqual(401);
  });

});