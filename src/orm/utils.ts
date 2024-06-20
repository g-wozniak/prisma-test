import {PostgrestSingleResponse} from '@supabase/supabase-js'

export function isSuccessful(response: PostgrestSingleResponse<any>) {
    return response.status === 200 || response.status === 201
}
