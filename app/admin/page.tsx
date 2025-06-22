'use client'

import Link from 'next/link'
import { LayoutDashboard, Building2, Landmark, Flag, Tags, Users, ListChecks } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/empresas" className="flex items-center gap-3 p-4 border rounded hover:bg-gray-50">
          <Building2 className="w-5 h-5" /> Empresas
        </Link>
        <Link href="/admin/usuarios" className="flex items-center gap-3 p-4 border rounded hover:bg-gray-50">
          <Users className="w-5 h-5" /> Usuários
        </Link>
        <Link href="/admin/planos" className="flex items-center gap-3 p-4 border rounded hover:bg-gray-50">
          <ListChecks className="w-5 h-5" /> Planos
        </Link>
        <Link href="/admin/denuncias" className="flex items-center gap-3 p-4 border rounded hover:bg-gray-50">
          <Flag className="w-5 h-5" /> Denúncias
        </Link>
        <Link href="/admin/categorias" className="flex items-center gap-3 p-4 border rounded hover:bg-gray-50">
          <Tags className="w-5 h-5" /> Categorias
        </Link>
        <Link href="/admin/cidades" className="flex items-center gap-3 p-4 border rounded hover:bg-gray-50">
          <Landmark className="w-5 h-5" /> Cidades
        </Link>
        <Link href="/admin/sugestoes" className="flex items-center gap-3 p-4 border rounded hover:bg-gray-50">
          <LayoutDashboard className="w-5 h-5" /> Sugestões
        </Link>
      </div>
    </div>
  )
}
