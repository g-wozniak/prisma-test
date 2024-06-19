import {Context} from 'hono'
import { env } from 'hono/adapter'
import {createClient} from '@supabase/supabase-js'



const helloHandler = (c: Context) => {
   const x =  env<any>(c)
   // const supabase = createClient(c.env.DB_URL, c.env.DB_KEY)
   console.log(x)
   return c.text(x)
}

export default helloHandler