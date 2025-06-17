'use client'

import { Suspense } from 'react';
import ResultadosComponent from './ResultadosComponent';

type Empresa = {
  id: number
  nome: string
  categoria: string
  cidade: string
  descricao: string
}

export default function Resultados() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [empresas, setEmpresas] = useState<Empresa[]>([])

  useEffect(() => {
    if (query.trim()) {
      // Simula dados (depois conectaremos ao Supabase)
      const resultadosFake: Empresa[] = [
        {
          id: 1,
          nome: 'Mega Engenharia',
          categoria: 'Engenharia Civil',
          cidade: 'Rio de Janeiro',
          descricao: 'Projetos e obras com excelência.',
        },
        {
          id: 2,
          nome: 'Mega Solar',
          categoria: 'Energia Solar',
          cidade: 'Niterói',
          descricao: 'Soluções completas em energia renovável.',
        },
      ]

      const filtrados = resultadosFake.filter((empresa) =>
        empresa.nome.toLowerCase().includes(query.toLowerCase())
      )
      setEmpresas(filtrados)
    }
  }, [query])

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Resultados para: "{query}"</h1>

      {empresas.length === 0 ? (
        <p className="text-gray-600">Nenhuma empresa encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {empresas.map((empresa) => (
            <li key={empresa.id} className="p-4 border rounded-md shadow-sm bg-white">
              <h2 className="text-xl font-semibold">{empresa.nome}</h2>
              <p className="text-sm text-gray-600">{empresa.categoria} - {empresa.cidade}</p>
              <p className="mt-2 text-gray-800">{empresa.descricao}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
