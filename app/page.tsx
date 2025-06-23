import { buscarCategoriasPopulares } from '@/lib/supabase/categorias'

export default async function Home() {
  const categorias = await buscarCategoriasPopulares()

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-zinc-900 text-black dark:text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎯 Categorias Populares</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categorias.map((c) => (
            <div
              key={c.categoria}
              className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-md hover:scale-105 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold">{c.categoria}</h2>
              <p className="text-sm text-zinc-500">{c.count} empresas</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
