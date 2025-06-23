import { buscarCategoriasPopulares } from '@/lib/supabase/categorias'

export default async function Home() {
  const categorias = await buscarCategoriasPopulares()

  return (
    <div>
      <h1>Categorias Populares</h1>
      <ul>
        {categorias.map((c) => (
          <li key={c.categoria}>
            {c.categoria} ({c.count})
          </li>
        ))}
      </ul>
    </div>
  )
}
