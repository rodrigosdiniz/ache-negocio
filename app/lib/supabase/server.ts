'use server'

import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ou use o ANON_KEY se for apenas leitura
  {
    cookies
  }
)
