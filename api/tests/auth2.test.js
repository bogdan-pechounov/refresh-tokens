const request = require('supertest')
const app = require('../src/app.js')
const db = require('./db.js')()
const authController = require('../src/controllers/authController')
const hashPassword = jest.spyOn(authController, 'hashPassword')

//in memory database
beforeAll(async () => await db.connect())
afterEach(async () => {
  // jest.resetAllMocks()
  await db.clear()
})
afterAll(async () => await db.disconnect())

it('hashes the password', async () => {
  console.log(require('../src/controllers/authController'))
  const user = await request(app)
    .post('/auth/signup')
    .send({ name: 'User', password: 'password', confirmPassword: 'password' })
  console.log(user.body)
  expect(hashPassword).toHaveBeenCalledWith('password')
})
