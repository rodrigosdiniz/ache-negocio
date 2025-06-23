'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <motion.nav
      className="bg-white shadow-md sticky top-0 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Ache<span className="text-blue-600">Negócio</span>
        </Link>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
            Entrar
          </Link>
          <Link href="/cadastro" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            Cadastrar empresa
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
