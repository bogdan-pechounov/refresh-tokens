const request = require('supertest')
const app = require('../src/app.js')
const sendMail = require('../src/utils/mail.js')
const db = require('./db.js')()

//in memory database
beforeAll(async () => await db.connect())
afterEach(async () => await db.clear())
afterAll(async () => await db.disconnect())

sendMail = jest.fn() //avoid sending emails during tests

describe('signup', () => {
  it('fails validation with status code 400', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ name: 'User', email: 'test@test.com' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    await request(app)
      .post('/auth/signup')
      .send({ email: 'test@test.com' })
      .set('Accept', 'application/json')
      .expect(400)

    await request(app)
      .post('/auth/signup')
      .send({ name: 'User', password: 'pass' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    await request(app)
      .post('/auth/signup')
      .send({ name: 'User', email: 'test.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect(400)
  })

  it('succeeds with status code 201', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ name: 'User', password: 'password' })
      .set('Accept', 'application/json')
      .expect(201)

    await request(app)
      .post('/auth/signup')
      .send({ name: 'User 2', email: 'test@test.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect(201)
  })

  it('sends cookies', async () => {
    const agent = request.agent(app)
    await agent.get('/auth').expect(401)
    const response = await agent
      .post('/auth/signup')
      .send({ name: 'User', password: 'password' })
    expect(
      response.headers['set-cookie'].find((header) =>
        header.includes('refreshToken')
      )
    ).toBeTruthy()

    await agent.get('/auth').expect(202)
  })
})
