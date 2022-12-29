import request from 'supertest'
import app from './app.js'

describe('GET /', () => {
  test('responds with some default message', async () => {
    const response = await request(app).get('/')
    expect(response.text.length).toBeGreaterThan(1000)
  })
})
