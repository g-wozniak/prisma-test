import {HTTPException} from 'hono/http-exception'
import {z} from 'zod'
import {Context} from 'hono'
import {Env} from '../../types'

export const POST = {
   schema: z.object({
      title: z.string().optional(),
      content: z.string(),
      blogId: z.number()
   }),
   handler: async (c: Context<Env>) => {
      // Get the Supabase client
      const db = c.get('supabase')

      // Get the request body
      const {title, content, blogId} = await c.req.json() as z.infer<typeof POST.schema>

      // Check if given blogId exists
      // Possible enhancement: if user has permission to add to this post based on JWT etc.
      const blog = await db.from('blogs').select().eq('id', blogId).single()
      if (!blog.data) {
         throw new HTTPException(401, {
            message: `Unable to create a post. Blog ${blogId} does not exist`
         })
      }

      // Create a new post
      const result = await db.from('posts').insert( {
         title,
         content,
         blogId
      }).select()

      // Check if the post was created successfully
      if (result.status !== 201 || !result.data || !result.data[0].id) {
         console.error(result.error)
         throw new HTTPException(500, {
            message: `Unable to create a post. ${result.error?.message}`
         })
      }

      // Return the blog ID and the number of posts created
      return c.json({
         id: result.data[0].id
      })
   }
}