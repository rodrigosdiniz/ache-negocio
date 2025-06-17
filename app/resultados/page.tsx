// app/resultados/page.tsx
import { Suspense } from 'react'
import ResultadosComponent from './ResultadosComponent'

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando resultados...</p>}>
      <ResultadosComponent />
    </Suspense>
  )
}
