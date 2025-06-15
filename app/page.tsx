import Hero from './components/Hero'
import Features from './components/Features'
import SearchSection from './components/SearchSection'
import CallToAction from './components/CallToAction'
import BusinessList from './components/BusinessList'

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <SearchSection />
      <CallToAction />
      <BusinessList />
    </main>
  );
}

