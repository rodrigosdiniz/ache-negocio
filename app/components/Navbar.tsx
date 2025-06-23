'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          AcheNegócio
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/empresas" className="hover:text-blue-600 transition-colors">Empresas</Link>
          <Link href="/painel" className="hover:text-blue-600 transition-colors">Painel</Link>
          <Link href="/cadastro" className="hover:text-blue-600 transition-colors">Cadastrar</Link>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-4 p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </div>
    </header>
  )
}
