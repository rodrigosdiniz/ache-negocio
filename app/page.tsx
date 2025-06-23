import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ache Negócio | Encontre Empresas de Qualquer Setor',
  description:
    'Busque empresas por cidade, categoria ou nome. Avalie serviços, encontre contatos e destaque seu negócio com nosso diretório inteligente.',
}

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: categorias, error } = await supabase
    .from('empresas')
    .select('categoria, count:categoria')
    .group('categoria')
    .order('count', { ascending: false })
    .limit(8)

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12">
      <div className="max-w-5xl w-full text-center mt-20">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-fade-in">
          Encontre empresas em qualquer cidade ou setor
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in delay-100">
          Compare avaliações, entre em contato e descubra os melhores serviços perto de você.
        </p>
      </div>

      <div className="max-w-6xl w-full mt-10">
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
      </div>
    </main>
  )
}
