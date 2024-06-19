import {SupabaseClient} from '@supabase/supabase-js'
import {Database} from './orm/db.types'

export type Env = {
   Bindings: {
      DB_KEY: string
      DB_URL: string
   }
   Variables: {
      supabase:  SupabaseClient<Database>
   }
}
