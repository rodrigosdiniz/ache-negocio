import { createClient } from '@/lib/supabase/server'

export async function buscarCategoriasPopulares() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nome, slug')
    .order('nome', { ascending: true })
    .limit(12)

  if (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }

  return data
}
