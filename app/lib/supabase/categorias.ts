'use server'

import { supabase } from './server' // ou './client', dependendo do contexto

export async function buscarCategoriasPopulares() {
  const { data, error } = await supabase.rpc('categorias_populares');

  if (error) {
    throw new Error("Erro ao buscar categorias: " + error.message);
  }

  return data as { categoria: string; count: number }[];
}
