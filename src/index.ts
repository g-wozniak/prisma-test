import {Hono} from 'hono'
import {zValidator} from '@hono/zod-validator'
import {createClient} from '@supabase/supabase-js'

import {Database} from './orm/db.types'
import {Env} from './types'
import {BlogsGet, BlogsPost, PostsPost} from './handlers'

const app = new Hono<Env>()

app.use(async (c, next) => {
   c.set('supabase', createClient<Database>(c.env.DB_URL, c.env.DB_KEY))
   await next()
})

// Create a new blog with or without posts
app.post('/blogs', zValidator('json', BlogsPost.schema), BlogsPost.handler)

// Search for a blog
app.get('/blogs/:uniqueRef', zValidator('query', BlogsGet.schema), BlogsGet.handler)

// Create a new posts for a blog
app.post('/posts', zValidator('json', PostsPost.schema), PostsPost.handler)

export default app
