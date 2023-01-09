import { rest } from 'msw'
import { BASE_URL } from '../../utils/api'

export const handlers = [
  rest.post(BASE_URL + '/auth/signup', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}))
  }),
  rest.post(BASE_URL + '/auth/login', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}))
  }),
  rest.get(BASE_URL + '/auth/me', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}))
  }),
  rest.get(BASE_URL + '/auth/logout', (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.get(BASE_URL + '/posts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ posts: [], count: 0 }))
  }),
]
