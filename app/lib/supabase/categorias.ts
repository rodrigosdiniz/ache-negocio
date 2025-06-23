import { getSupabaseServer } from './server'

export async function buscarCategoriasPopulares() {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.rpc('categorias_populares')

  if (error) {
    throw new Error("Erro ao buscar categorias populares: " + error.message)
  }

  return data as { categoria: string; count: number }[]
}
