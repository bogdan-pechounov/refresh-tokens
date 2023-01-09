const request = require('supertest')
const app = require('../src/app.js')
const db = require('./db.js')
const User = require('../src/models/user.js')

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

describe('/user', () => {
  it('deletes user', async () => {
    const agent = await createAgent()
    await agent.post('/auth/signup').send({
      name: 'User',
      email: 'test@test.com',
      password: 'password',
      confirmPassword: 'password',
    })
    expect((await User.find()).length).toBe(1)
    await agent.delete('/user')
    expect((await User.find()).length).toBe(0)
  })

  it('changes username', async () => {
    const agent = await createAgent()
    await agent.post('/auth/signup').send({
      name: 'User',
      email: 'test@test.com',
      password: 'password',
      confirmPassword: 'password',
    })

    await agent
      .put('/user')
      .field('name', 'User 2')
      .field('image', '')
      .expect(200)

    const { body: user } = await agent.get('/user')
    expect(user.name).toBe('User 2')
  })

  it('changes password', async () => {
    const agent = await createAgent()
    await agent.post('/auth/signup').send({
      name: 'User',
      email: 'test@test.com',
      password: 'password',
      confirmPassword: 'password',
    })

    await agent
      .put('/user')
      .field('name', 'User')
      .field('password', 'password2')
      .field('confirmPassword', 'password2')
      .expect(200)

    const response = await agent.get('/auth/logout')
    const csrfToken = response.headers['x-csrf-token']
    agent.set('X-CSRF-Token', csrfToken)

    await agent
      .post('/auth/login')
      .send({ name: 'User', password: 'password' })
      .expect(401)
    await agent
      .post('/auth/login')
      .send({ name: 'User', password: 'password2' })
      .expect(200)
  })
})
