import { Container } from '@/components/Container'
import { HeroVisualPanel } from '@/components/HeroVisualPanel'

/**
 * v2 hero — Figma diptych: black copy panel + interactive sticker canvas.
 */
export function HeroSectionStatic() {
  return (
    <section data-hero-section className="hero-v2">
      <Container className="pt-[16px]">
        <div className="hero-v2__diptych">
          <div className="hero-v2__panel hero-v2__panel--copy">
            <h1 className="hero-v2__headline">Crafting with intention.</h1>
          </div>

          <HeroVisualPanel />
        </div>
      </Container>
    </section>
  )
}
