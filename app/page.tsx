import Hero from './components/Hero'
import Features from './components/Features'
import SearchSection from './components/SearchSection'
import CallToAction from './components/CallToAction'
import BusinessList from './components/BusinessList'
import Footer from './components/Footer';


export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <SearchSection />
      <CallToAction />
      <BusinessList />
      <Footer /> {/* <-- Esta linha adiciona o rodapé */}
    </main>
  );
}

