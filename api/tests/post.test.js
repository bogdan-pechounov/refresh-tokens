const request = require('supertest')
const app = require('../src/app.js')
const db = require('./db.js')()

//in memory database
beforeAll(async () => await db.connect())
afterEach(async () => await db.clear())
afterAll(async () => await db.disconnect())

//set csrf token header
async function createAgent() {
  const agent = request.agent(app)
  const response = await agent.get('/')
  const csrfToken = response.headers['x-csrf-token']
  agent.set('X-CSRF-Token', csrfToken)
  return agent
}

describe('/posts', () => {
  it('creates a post', async () => {
    const agent = await createAgent()
    await agent.post('/auth/signup').send({
      name: 'User',
      email: 'test@test.com',
      password: 'password',
      confirmPassword: 'password',
    })

    await agent
      .post('/posts')
      .send({ title: 'Title', body: 'adsfkjsadklfdj;sdffd' })
      .expect(201)
  })

  it('gets posts', async () => {
    const agent = await createAgent()
    await agent.post('/auth/signup').send({
      name: 'User',
      email: 'test@test.com',
      password: 'password',
      confirmPassword: 'password',
    })

    await agent
      .post('/posts')
      .send({ title: 'Title', body: 'adsfkjsadklfdj;sdffd' })
      .expect(201)

    await agent
      .post('/posts')
      .send({ title: 'Title', body: 'adsfkjsadklfdj;sdffd' })
      .expect(201)

    const response = await agent.get('/posts').expect(200)
    expect(response.body.count).toBe(2)
  })
})
