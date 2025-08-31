import { Header } from '@/components/Header'
import { LandingHero } from '@/components/LandingHero'
import { ExamplesSection } from '@/components/ExamplesSection'
import { PricingBanner } from '@/components/PricingBanner'
import { ContactForm } from '@/components/ContactForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <LandingHero />
        <ExamplesSection />
        <PricingBanner />
        <ContactForm />
      </main>
    </div>
  )
}