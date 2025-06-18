import { Suspense } from 'react'
import ResultadosComponent from './ResultadosComponent'

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Carregando resultados...</p>}>
      <ResultadosComponent />
    </Suspense>
  )
}
