import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-20 px-6 md:px-12">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          Ache os melhores negócios da sua cidade
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Encontre empresas, serviços e oportunidades perto de você com um clique.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Link href="/cadastro">
            <Button className="text-lg px-6 py-4 rounded-2xl shadow-xl">
              Cadastrar empresa <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Categorias ou Destaques */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 md:px-12 pb-20">
        {["Restaurantes", "Saúde", "Construção", "Educação", "Tecnologia", "Beleza"].map((categoria, i) => (
          <motion.div 
            key={categoria}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-2">{categoria}</h3>
            <p className="text-gray-500 text-sm">Empresas da área de {categoria.toLowerCase()}.</p>
          </motion.div>
        ))}
      </section>
    </main>
  )
}
