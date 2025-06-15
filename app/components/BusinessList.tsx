import CompanyCard from "./CompanyCard"

const companies = [
  {
    name: "Nexus Engenharia",
    category: "Engenharia Estrutural",
    city: "Rio de Janeiro",
    state: "RJ",
    phone: "(21) 97781-4334",
    imageUrl: "/empresa-nexus.jpg",
  },
  {
    name: "Clínica Bem Estar",
    category: "Saúde",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 98888-1111",
    imageUrl: "/clinica-bemestar.jpg",
  },
  {
    name: "Contábil Alfa",
    category: "Contabilidade",
    city: "Belo Horizonte",
    state: "MG",
    phone: "(31) 92222-3333",
    imageUrl: "/contabil-alfa.jpg",
  },
]

export default function BusinessList() {
  return (
    <section className="py-8 px-4 md:px-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">Empresas em destaque</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {companies.map((company, index) => (
          <CompanyCard key={index} {...company} />
        ))}
      </div>
    </section>
  )
}
