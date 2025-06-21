// app/empresas/page.tsx
"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";

interface Empresa {
  id: string;
  nome: string;
  cidade: string;
  categoria: string;
  nota_media: number | null;
}

export default function ListaEmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarEmpresas = async () => {
      const { data, error } = await supabase
        .from("empresas")
        .select("id, nome, cidade, categoria, nota_media")
        .order("nome", { ascending: true });

      if (!error && data) setEmpresas(data);
      setLoading(false);
    };

    carregarEmpresas();
  }, []);

  if (loading) {
    return <p className="text-center py-10 text-gray-600">Carregando empresas...</p>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Empresas Cadastradas</h1>

      {empresas.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhuma empresa encontrada.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {empresas.map((empresa) => (
            <li key={empresa.id} className="border p-4 rounded shadow hover:shadow-lg transition">
              <Link href={`/empresa/${empresa.id}`} className="text-blue-600 font-semibold text-lg hover:underline">
                {empresa.nome}
              </Link>
              <p className="text-sm text-gray-600">{empresa.cidade} • {empresa.categoria}</p>
              {empresa.nota_media !== null && (
                <p className="flex items-center gap-1 text-sm text-yellow-600 mt-1">
                  <Star className="w-4 h-4 fill-yellow-500" /> {empresa.nota_media.toFixed(1)} / 5
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
