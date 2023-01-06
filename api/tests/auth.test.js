const request = require('supertest')
const app = require('../src/app.js')
const sendMail = require('../src/utils/mail.js')
const db = require('./db.js')()
const { CookieAccessInfo } = require('cookiejar')
const User = require('../src/models/user.js')

//in memory database
beforeAll(async () => await db.connect())
afterEach(async () => await db.clear())
afterAll(async () => await db.disconnect())

jest.mock('../src/utils/mail.js') //avoid sending emails during tests

//set csrf token header
async function createAgent() {
  const agent = request.agent(app)
  const response = await agent.get('/')
  const csrfToken = response.headers['x-csrf-token']
  agent.set('X-CSRF-Token', csrfToken)
  return agent
}

describe('signup', () => {
  it('sets csrf token', async () => {
    const agent = request.agent(app)
    const response = await agent.get('/')
    const csrfToken = response.headers['x-csrf-token']
    expect(csrfToken).toBeDefined()
  })

  it('fails validation with status code 400', async () => {
    const agent = request.agent(app)
    const response = await agent.get('/')
    const csrfToken = response.headers['x-csrf-token']
    agent.set('X-CSRF-Token', csrfToken)

    await agent
      .post('/auth/signup')
      .send({ name: 'User', email: 'test@test.com' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    await agent
      .post('/auth/signup')
      .send({ email: 'test@test.com' })
      .set('Accept', 'application/json')
      .expect(400)

    await agent
      .post('/auth/signup')
      .send({ name: 'User', password: 'pass' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    await agent
      .post('/auth/signup')
      .send({ name: 'User', email: 'test.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect(400)

    await agent
      .post('/auth/signup')
      .send({
        name: 'User',
        email: 'test.com',
        password: 'password',
        confirmPassword: 'sladdfasj',
      })
      .set('Accept', 'application/json')
      .expect(400)
  })

  it('succeeds with status code 201', async () => {
    const agent = request.agent(app)
    const response = await agent.get('/')
    const csrfToken = response.headers['x-csrf-token']
    agent.set('X-CSRF-Token', csrfToken)

    await agent
      .post('/auth/signup')
      .send({ name: 'User', password: 'password', confirmPassword: 'password' })
      .set('Accept', 'application/json')
      .expect(201)

    await agent
      .post('/auth/signup')
      .send({ name: 'User', password: 'password', confirmPassword: 'password' })
      .set('Accept', 'application/json')
      .expect(409)

    await agent
      .post('/auth/signup')
      .send({
        name: 'User 2',
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      })
      .set('Accept', 'application/json')
      .expect(201)
  })

  it('sends cookies', async () => {
    const agent = request.agent(app)
    const { headers } = await agent.get('/auth/me').expect(401)
    const csrfToken = headers['x-csrf-token']
    agent.set('X-CSRF-Token', csrfToken)

    const response = await agent
      .post('/auth/signup')
      .send({ name: 'User', password: 'password', confirmPassword: 'password' })
    expect(
      response.headers['set-cookie'].find((header) =>
        header.includes('refreshToken')
      )
    ).toBeTruthy()

    await agent.get('/auth/me').expect(200)
  })

  it('sends an email', async () => {
    const agent = request.agent(app)
    const response = await agent.get('/')
    const csrfToken = response.headers['x-csrf-token']
    agent.set('X-CSRF-Token', csrfToken)

    await agent.post('/auth/signup').send({
      name: 'User',
      email: 'test@test.com',
      password: 'password',
      confirmPassword: 'password',
    })
    expect(sendMail).toHaveBeenCalled()
  })

  it('sets an accessToken header', async () => {
    const agent = await createAgent()
    const agent2 = await createAgent()

    const response = await agent.post('/auth/signup').send({
      name: 'User',
      email: 'test@test.com',
      password: 'password',
      confirmPassword: 'password',
    })
    const accessToken = response.headers['x-access-token']
    expect(accessToken).toBeDefined()

    await agent2.get('/auth/me').expect(401)
    await agent
      .get('/auth/me')
      .set({ 'X-Access-Token': accessToken })
      .expect(200)
    await agent.get('/auth/me').set({ 'X-Access-Token': 'invalid' }).expect(401)
  })

  it('resets tokens', async () => {
    //sign up
    const agent = await createAgent()
    let response = await agent.post('/auth/signup').send({
      name: 'User',
      email: 'test@test.com',
      password: 'password',
      confirmPassword: 'password',
    })

    const prevAccessToken = response.headers['x-access-token']
    console.log(response.headers['set-cookie'])
    const prevRefreshToken = agent.jar.getCookie(
      'refreshToken',
      CookieAccessInfo()
    ).value

    //use access token
    response = await agent
      .get('/auth/me')
      .set({ 'X-Access-Token': prevAccessToken })
      .expect(200)

    let accessToken = response.headers['x-access-token']
    let refreshToken = agent.jar.getCookie(
      'refreshToken',
      CookieAccessInfo()
    ).value

    expect(accessToken).toBeUndefined()
    expect(refreshToken).toEqual(prevRefreshToken)

    //wait so that the new tokens will be different
    const now = Date.now()
    Date.now = jest.fn(() => now + 10000)
    //don't use access token to trigger a token reset
    response = await agent.get('/auth/me').expect(200)
    accessToken = response.headers['x-access-token']
    refreshToken = agent.jar.getCookie('refreshToken', CookieAccessInfo()).value

    expect(accessToken).toBeDefined()
    // expect(accessToken).not.toEqual(prevAccessToken)
    expect(refreshToken).not.toEqual(prevRefreshToken)
  })

  it('deletes token on logout', async () => {
    const agent = await createAgent()
    let response = await agent.post('/auth/signup').send({
      name: 'User',
      email: 'test@test.com',
      password: 'password',
      confirmPassword: 'password',
    })
    let user = await User.findById(response.body._id)
    expect(user.refreshTokens.length).toBe(1)
    await agent.get('/auth/logout')
    user = await User.findById(response.body._id)
    expect(user.refreshTokens.length).toBe(0)
  })

  it('detects refresh token reuse', async () => {
    const agent = await createAgent()
    let response = await agent.post('/auth/signup').send({
      name: 'User',
      email: 'test@test.com',
      password: 'password',
      confirmPassword: 'password',
    })
    const cookie = response.headers['set-cookie']
    await agent.get('/auth/logout')

    //compromised cookie
    response = await request(app)
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(401)
  })
})
