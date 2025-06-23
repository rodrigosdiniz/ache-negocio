'use client'

import { useToast } from '@/context/ToastContext'

export default function EmpresaCadastrar() {
  const { showToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('Empresa cadastrada com sucesso!', 'success')
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ...campos... */}
      <button type="submit">Salvar</button>
    </form>
  )
}
