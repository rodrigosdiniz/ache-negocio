// app/lib/supabase/categorias.ts
'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function buscarCategoriasPopulares() {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase
    .from('empresas')
    .select('categoria, count:categoria')
    .group('categoria')
    .order('count', { ascending: false })
    .limit(8)

  if (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }

  return data
}
