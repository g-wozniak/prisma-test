import {Hono} from 'hono'
import { zValidator } from '@hono/zod-validator'
import {createClient} from '@supabase/supabase-js'

import {Database} from './orm/db.types'
import {Env} from './types'
import {BlogsPost} from './handlers'


const app = new Hono<Env>()

app.use(async (c, next) => {
   c.set('supabase', createClient<Database>(c.env.DB_URL, c.env.DB_KEY))
   await next()
})

// Change to post
app.post('/blogs', zValidator('json', BlogsPost.schema), BlogsPost.handler)

export default app
