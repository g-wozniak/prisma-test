import {HTTPException} from 'hono/http-exception'
import {z} from 'zod'
import {Context} from 'hono'
import {Env, TSupabaseClient} from '../../types'
import {BlogFields} from '../../orm/aliases'
import {isSuccessful} from '../../orm/utils'

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
      if (!isSuccessful(blogResult) || !blogResult.data || !blogResult.data[0].id) {
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


const getQuery = (db: TSupabaseClient, {fields, uniqueRef, withPosts}: {
   fields: BlogFields[]
   uniqueRef: string
   withPosts: boolean
}) => {
   const isId = /^\d+$/.test(uniqueRef)
   const fieldsAsString = fields.join(',')
   return () => db.from('blogs')
      .select(`${fieldsAsString}${withPosts ? ',posts (*)' : ''}`)
      .eq(isId
         ? 'id'
         : 'slug', uniqueRef)
      .single()
}

type GetParams = {
   uniqueRef: string
}

export const GET = {
   schema: z.object({
      withPosts: z.string().regex(/true/).optional()
   }),
   handler: async (c: Context<Env>) => {
      // Get the Supabase client
      const db = c.get('supabase')

      // Get the unique ref mapped to the route
      const {uniqueRef} = c.req.param() as GetParams

      // Get the flag whether to display all the posts
      const {withPosts} = c.req.query() as z.infer<typeof GET.schema>

      // Build the query depending on uniqueRef type and whether the posts should be displayed
      const result = await getQuery(db, {
         fields: ['id', 'name', 'slug', 'createdAt'],
         uniqueRef,
         withPosts: withPosts === 'true'
      })()

      if (!isSuccessful(result)) {
         throw new HTTPException(500, {
            message: `Unable to complete the operation. ${result.error?.message}`
         })
      }

      return c.json(result.data || {})
   }
}