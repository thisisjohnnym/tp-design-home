import { Container } from '@/components/Container'
import { StickerCanvasSection } from '@/components/StickerCanvasSection'

/**
 * Isolated sticker sheet for Figma MCP capture (generate_figma_design).
 * Viewport matches browser selection: 910×559 CSS px (870 content + 20px margins).
 */
export default function StickerSheetFigmaCapturePage() {
  return (
    <div
      className="font-sans antialiased"
      style={{
        background: 'var(--page-ground)',
        color: 'var(--page-ink)',
        width: 910,
        minHeight: 559,
      }}
      data-figma-capture="sticker-sheet"
    >
      <Container className="pt-0 pb-0">
        <StickerCanvasSection />
      </Container>
    </div>
  )
}
