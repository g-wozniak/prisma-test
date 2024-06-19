import {Database} from './db.types'

export type Blog = Database['public']['Tables']['blogs']['Row']

export type Post = Database['public']['Tables']['posts']['Row']