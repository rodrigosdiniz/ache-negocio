'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <motion.main
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center dark:bg-gray-950 dark:text-white bg-white text-gray-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Ache Negócio
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl max-w-xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        O seu diretório inteligente de empresas. Cadastre sua empresa, avalie serviços e encontre as melhores soluções perto de você.
      </motion.p>
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <Link
          href="/cadastro"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Cadastrar Empresa
        </Link>
        <Link
          href="/login"
          className="border border-gray-400 text-gray-800 dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Acessar Painel
        </Link>
      </motion.div>
    </motion.main>
  )
}
