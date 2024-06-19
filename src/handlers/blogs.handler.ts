import { z } from 'zod'
import {Context} from 'hono'
import {Env} from '../types'

export const POST = {
   schema: z.object({
      name: z.string(),
      slug: z.string().regex(new RegExp('^[a-z](-?[a-z])*$')),
      posts: z.array(z.object({
         title: z.string().optional(),
         content: z.string()
      })).optional()
   }),
   handler: async (c: Context<Env>) => {
      const db = c.get('supabase')
      /*
      const result = await db.from('blogs').insert([{
         name: 'Dummy blog new',
         slug: 'dummy-blog-2'
      }])*/

      const body = await c.req.json()
      return c.json(body)
   }
}