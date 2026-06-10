import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { QuirkyCapabilities } from '@/components/quirky/QuirkyCapabilities'
import { QuirkyFooter } from '@/components/quirky/QuirkyFooter'
import { QuirkyHero } from '@/components/quirky/QuirkyHero'
import { QuirkyManifesto } from '@/components/quirky/QuirkyManifesto'
import { QuirkyProcess } from '@/components/quirky/QuirkyProcess'
import { QuirkyTeamSection } from '@/components/quirky/QuirkyTeamSection'
import { team } from '@/data/content'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-quirky-serif',
})

export const metadata: Metadata = {
  title: 'tapestry.design — quirky',
  description: 'The fun side of Tapestry Product Design.',
}

export default function QuirkyPage() {
  return (
    <div
      className={`quirky-page ${instrumentSerif.variable} min-h-screen bg-[#FAF3E8] font-sans text-[#1A1A1A] antialiased`}
    >
      <QuirkyHero />
      <QuirkyManifesto />
      <QuirkyTeamSection members={team} />
      <QuirkyCapabilities />
      <QuirkyProcess />
      <QuirkyFooter />
    </div>
  )
}
