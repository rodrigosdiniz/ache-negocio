'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          AcheNegócio
        </Link>

        {/* Menu */}
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/empresas" className="hover:text-blue-600 transition-colors">Empresas</Link>
          <Link href="/paine
