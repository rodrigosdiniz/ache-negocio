import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function ExcluirEmpresaPage({ params }: { params: { id: string } }) {
  const supabase = createClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: empresa, error } = await supabase
    .from('empresas')
    .select('id, nome, user_id')
    .eq('id', params.id)
    .single()

  if (!empresa || empresa.user_id !== user.id) {
    return redirect('/painel')
  }

  const excluirEmpresa = async () => {
    'use server'
    const supabase = createClient()
    await supabase.from('empresas').delete().eq('id', params.id)
    cookies().set('toast', 'Empresa excluída com sucesso.')
    redirect('/painel')
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Excluir Empresa</h1>
      <p className="mb-4">
        Tem certeza que deseja excluir a empresa <strong>{empresa.nome}</strong>? Essa ação é <span className="text-red-600 font-semibold">irreversível</span>.
      </p>
      <form action={excluirEmpresa}>
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Confirmar Exclusão
        </button>
        <a
          href="/painel"
          className="ml-4 text-blue-600 underline"
        >
          Cancelar
        </a>
      </form>
    </main>
  )
}
