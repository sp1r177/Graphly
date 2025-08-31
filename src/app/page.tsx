import { LandingHero } from '@/components/LandingHero'
import { ContactForm } from '@/components/ContactForm'

export default function Home() {
  return (
    <div className="min-h-screen">
      <LandingHero />
      <ContactForm />
    </div>
  )
}