import app from '../../index'
import {MOCK_ENV} from '../../mocks'
import {Post} from '../../orm/aliases'

describe('→ posts.handler', () => {

   describe('→ POST /posts', () => {

      test('→ fails if the post content is not provided', async () => {
         const res = await app.request('/posts', {
            method: 'POST',
            body: JSON.stringify({
               title: 'My first post',
               blogId: 1
            })
         }, MOCK_ENV)
         expect(res.status).toBe(400)
      })

      test('→ fails if the blogId is not provided', async () => {
         const res = await app.request('/blogs', {
            method: 'POST',
            body: JSON.stringify({
               title: 'My first post',
               content: 'Hello, world!'
            })
         }, MOCK_ENV)
         expect(res.status).toBe(400)
      })

      test.skip('→ creates a post', async () => {
         const payload = {
            title: 'My first post in this blog',
            content: 'Hello, world!',
            blogId: 1
         }

         const expected: Post = {
            ...payload,
            viewCount: 0,
            id: 12,
            createdAt: '2021-01-01T00:00:00Z'
         }

         const res = await app.request('/posts', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
         }, MOCK_ENV)

         expect(await res.json()).toBe(expected)
      })

      test.skip('→ fails if the blog referenced by blogId does not exist')

      test.skip('→ fails if the database operation failed')
   })
})