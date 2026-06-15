import { Grid, Col } from '@/components/Grid'
import { StickerCanvasPanel } from '@/components/StickerCanvasPanel'

export function StickerCanvasSection() {
  return (
    <section className="sticker-canvas-section">
      <Grid className="items-start">
        <Col span={24}>
          <StickerCanvasPanel className="sticker-canvas-section__panel flex min-h-0 flex-col" />
        </Col>
      </Grid>
    </section>
  )
}
