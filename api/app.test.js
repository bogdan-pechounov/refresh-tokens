const request = require('supertest')
const app = require('./app.js')

describe('GET /', () => {
  test('responds with some default message', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
    expect(response.text.length).toBeGreaterThan(0)
  })

  test('test', () => {
    expect(1).toBe(1)
  })
})
