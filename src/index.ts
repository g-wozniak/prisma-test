import {Context, Hono} from 'hono'
import helloHandler from './hello.handler'
import {createClient} from '@supabase/supabase-js'
import {Database} from './orm/db.types'

type Env = {
   Bindings: {
      DB_KEY: string
      DB_URL: string
   }
}


const app = new Hono<Env>()

app.get('/', async (c) => {
   const supabase = createClient<Database>(c.env.DB_URL, c.env.DB_KEY)

   const result = await supabase.from('blogs').insert([{
      name: 'Dummy blog new',
      slug: 'dummy-blog-2'
   }])


   return c.json(result.data)
})

export default app
