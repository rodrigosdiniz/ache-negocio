'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import EmpresaCard from '@/components/EmpresaCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

interface Empresa {
  id: string
  nome: string
  cidade: string
  categoria: string
  nota_media: number | null
  imagem_url: string | null
}

export default function EmpresasPorCategoria({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [cidade, setCidade] = useState('')
  const [notaMinima, setNotaMinima] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const itensPorPagina = 6

  useEffect(() => {
    const buscarEmpresas = async () => {
      setCarregando(true)

      const query = supabase
        .from('empresas')
        .select('*', { count: 'exact' })
        .ilike('categoria', `%${params.slug}%`)
        .gte('nota_media', notaMinima)

      if (cidade) {
        query.ilike('cidade', `%${cidade}%`)
      }

      query.order('nome', { ascending: true })
        .range((pagina - 1) * itensPorPagina, pagina * itensPorPagina - 1)

      const { data, count } = await query

      if (data) setEmpresas(data)
      if (count) setTotalPaginas(Math.ceil(count / itensPorPagina))
      setCarregando(false)
    }

    buscarEmpresas()
  }, [params.slug, cidade, notaMinima, pagina])

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold capitalize mb-4">Categoria: {params.slug.replace('-', ' ')}</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 space-y-4">
          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: Rio de Janeiro" />
          </div>

          <div>
            <Label htmlFor="nota">Nota mínima</Label>
            <Slider
              defaultValue={[notaMinima]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={([value]) => setNotaMinima(value)}
            />
            <span className="text-sm text-gray-600">{notaMinima.toFixed(1)} estrelas ou mais</span>
          </div>

          <Button variant="outline" onClick={() => {
            setCidade('')
            setNotaMinima(0)
            setPagina(1)
          }}>Limpar Filtros</Button>
        </aside>

        <section className="md:col-span-3 space-y-6">
          {carregando ? (
            <p className="text-gray-500">Carregando empresas...</p>
          ) : empresas.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {empresas.map((empresa) => (
                <EmpresaCard key={empresa.id} empresa={empresa} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma empresa encontrada.</p>
          )}

          {totalPaginas > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  variant={n === pagina ? 'default' : 'outline'}
                  onClick={() => setPagina(n)}
                >
                  {n}
                </Button>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
