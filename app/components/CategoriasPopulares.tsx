// app/components/CategoriasPopulares.tsx
'use client'

import Link from 'next/link'

interface Categoria {
  categoria: string
  count: number
}

interface Props {
  categorias: Categoria[]
}

export function CategoriasPopulares({ categorias }: Props) {
  return (
    <section className="max-w-6xl w-full mt-10">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
        Categorias Populares
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
        {categorias?.map((item) => (
          <Link
            href={`/busca?categoria=${encodeURIComponent(item.categoria)}`}
            key={item.categoria}
            className="border rounded-2xl p-4 text-center shadow hover:shadow-lg transition bg-white dark:bg-zinc-900"
          >
            <p className="font-medium text-lg capitalize">{item.categoria}</p>
            <p className="text-sm text-muted-foreground">{item.count} empresas</p>
          </Link>
        ))}

        {categorias?.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            Nenhuma categoria encontrada.
          </p>
        )}
      </div>
    </section>
  )
}
