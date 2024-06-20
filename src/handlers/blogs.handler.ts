import {HTTPException} from 'hono/http-exception'
import {z} from 'zod'
import {Context} from 'hono'
import {Env} from '../types'

export const POST = {
   schema: z.object({
      name: z.string(),
      slug: z.string().regex(new RegExp('^[a-z](-?[a-z0-9])*$')),
      posts: z.array(z.object({
         title: z.string().optional(),
         content: z.string()
      })).optional()
   }),
   handler: async (c: Context<Env>) => {
      // Get the Supabase client
      const db = c.get('supabase')

      // Get the request body
      const body = await c.req.json() as z.infer<typeof POST.schema>

      // Create a new blog
      const blogResult = await db.from('blogs').insert( {
         name: body.name,
         slug: body.slug
      }).select()

      // Check if the blog was created successfully
      if (blogResult.status !== 201 || !blogResult.data || !blogResult.data[0].id) {
         console.error(blogResult.error)
         throw new HTTPException(500, {
            message: `Unable to create a blog. ${blogResult.error?.message}`
         })
      }

      // If there are posts, create them
      let postsCount = 0
      if (body.posts && Array.isArray(body.posts)) {
         const posts = body.posts.map(post => ({
            ...post,
            blogId: blogResult.data[0].id
         }))
         const postResult = await db.from('posts').insert(posts).select()
         postsCount = postResult.data?.length || 0
      }

      // Return the blog ID and the number of posts created
      return c.json({
         id: blogResult.data[0].id,
         posts: postsCount
      })
   }
}