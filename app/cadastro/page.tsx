// app/cadastro/page.tsx
'use client'

export default function CadastroPage() {
  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Cadastro</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nome da Empresa"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Cadastrar
        </button>
      </div>
    </main>
  )
}
