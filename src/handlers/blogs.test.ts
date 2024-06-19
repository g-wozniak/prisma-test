import * as nock from 'nock'
import app from '../index'
import {MOCK_ENV} from '../mocks'
import {Blog} from '../orm/aliases'

describe('→ blogs.handler', () => {

   describe('→ POST /blogs', () => {

      test('→ fails if the blog name is not provided', async () => {
         const res = await app.request('/blogs', {
            method: 'POST',
            body: JSON.stringify({
               slug: 'dummy-blog-2'
            })
         }, MOCK_ENV)
         expect(res.status).toBe(400)
      })

      test('→ fails if the blog slug is not provided', async () => {
         const res = await app.request('/blogs', {
            method: 'POST',
            body: JSON.stringify({
               name: 'My first blog'
            })
         }, MOCK_ENV)
         expect(res.status).toBe(400)
      })

      test.skip('→ creates a blog without posts', async () => {
         nock.disableNetConnect()
         const scope = nock(MOCK_ENV.DB_URL)
            .post('/rest/*')
            .reply(200, 'test response')

         const payload = {
            name: 'My first blog',
            slug: 'my-first-blog'
         }

         const expected: Blog = {
            ...payload,
            id: 12,
            createdAt: '2021-01-01T00:00:00Z'
         }

         const res = await app.request('/blogs', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
         }, MOCK_ENV)

         expect(await res.json()).toBe(expected)
      })

      test.todo('→ creates a blog with posts')

   })
})