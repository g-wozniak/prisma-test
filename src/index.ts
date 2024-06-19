import {Context, Hono} from 'hono'
import helloHandler from './hello.handler'
import {createClient} from '@supabase/supabase-js'

type Env = {
   Bindings: {
      DB_KEY: string
      DB_URL: string
   }
}


const app = new Hono<Env>()

app.get('/', (c) => {
   const x = c.env.DB_URL
   const supabase = createClient(c.env.DB_URL, c.env.DB_KEY)
   console.log(supabase)
   return c.text('Hello')
})

export default app
