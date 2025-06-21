// app/categoria/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categoriaNome = decodeURIComponent(params.slug).replace(/-/g, ' ')
  return {
    title: `Empresas de ${categoriaNome} | Ache Negócio`,
    description: `Encontre empresas de ${categoriaNome} em sua cidade. Veja avaliações, entre em contato e descubra serviços confiáveis.`
  }
}

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const supabase = createClient(cookies())
  const categoria = decodeURIComponent(params.slug).replace(/-/g, ' ')

  const { data: empresas } = await supabase
    .from('empresas')
    .select('*')
    .ilike('categoria', categoria)
    .order('nota_media', { ascending: false })

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Empresas de {categoria}</h1>
      <Link href="/categorias" className="text-blue-600 underline mb-6 inline-block">← Voltar para categorias</Link>

      {empresas && empresas.length > 0 ? (
        <ul className="grid md:grid-cols-2 gap-4">
          {empresas.map((empresa) => (
            <li key={empresa.id} className="border p-4 rounded bg-white shadow-sm">
              <Link href={`/empresa/${empresa.id}`} className="block hover:underline">
                {empresa.imagem_url && (
                  <Image
                    src={empresa.imagem_url}
                    alt={empresa.nome}
                    width={400}
                    height={200}
                    className="rounded mb-2 w-full object-cover h-40"
                  />
                )}
                <h2 className="text-xl font-semibold text-blue-700">{empresa.nome}</h2>
                <p className="text-sm text-gray-600">{empresa.cidade}</p>
                {empresa.nota_media !== null && (
                  <p className="text-sm text-yellow-600 mt-1">Nota: {empresa.nota_media.toFixed(1)} / 5</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">Nenhuma empresa encontrada nesta categoria.</p>
      )}
    </main>
  )
}
