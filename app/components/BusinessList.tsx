// components/BusinessList.tsx
import CompanyCard from "./CompanyCard";

export default function BusinessList() {
  const businesses = [
    {
      name: "Construtora RJ",
      description: "Projetos e reformas em toda a cidade.",
      image: "/empresas/empresa1.jpg",
      rating: 4.8,
      contactLink: "https://wa.me/5521999999999",
    },
    {
      name: "Contabilidade Prime",
      description: "Assessoria fiscal e tributária especializada.",
      image: "/empresas/empresa2.jpg",
      rating: 4.6,
      contactLink: "mailto:contato@prime.com",
    },
  ];

  return (
    <section className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {businesses.map((b, index) => (
        <CompanyCard key={index} {...b} />
      ))}
    </section>
  );
}
