'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="w-full py-24 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-extrabold leading-tight"
      >
        Encontre Empresas de Confiança na Sua Cidade
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-6 text-lg md:text-xl text-muted-foreground"
      >
        Compare avaliações, explore categorias e escolha com segurança no Ache Negócio.
      </motion.p>
    </section>
  )
}
