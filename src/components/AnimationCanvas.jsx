import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './AnimationCanvas.module.css'

const TOTAL_FRAMES = 240
const FRAME_DIR = '/frames/'

// Overlay config: which frame range each overlay is visible
const OVERLAY_CONFIG = [
  { from:  1, to: 22,  ids: ['act1'] },
  { from: 10, to: 55,  ids: ['text1', 'left1'] },
  { from: 60, to: 90,  ids: ['act2'] },
  { from: 70, to: 115, ids: ['text2', 'right2'] },
  { from:125, to: 155, ids: ['transition'] },
  { from:158, to: 178, ids: ['act3'] },
  { from:170, to: 215, ids: ['text3', 'left3'] },
  { from:220, to: 240, ids: ['final'] },
]

function frameSrc(n) {
  return FRAME_DIR + 'ezgif-frame-' + String(n).padStart(3, '0') + '.png'
}

function isVisible(id, frame) {
  return OVERLAY_CONFIG.some(c => c.ids.includes(id) && frame >= c.from && frame <= c.to)
}

export default function AnimationCanvas({ images, onFrameChange }) {
  const canvasRef    = useRef(null)
  const sectionRef   = useRef(null)
  const currentFrame = useRef(0)
  const rafRef       = useRef(null)
  const [activeOverlays, setActiveOverlays] = useState(new Set())
  const [displayFrame, setDisplayFrame] = useState(1)

  // Draw current frame
  const drawFrame = useCallback((idx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = images[idx]
    if (!img || !img.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext('2d')
    const { width: cw, height: ch } = canvas
    const iw = img.naturalWidth, ih = img.naturalHeight
    const scale = Math.max(cw / iw, ch / ih)
    const sw = iw * scale, sh = ih * scale
    const sx = (cw - sw) / 2, sy = (ch - sh) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, sx, sy, sw, sh)
  }, [images])

  // Resize canvas
  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    drawFrame(currentFrame.current)
  }, [drawFrame])

  // Scroll handler
  const onScroll = useCallback(() => {
    const section = sectionRef.current
    if (!section) return
    const rect    = section.getBoundingClientRect()
    const totalH  = section.offsetHeight - window.innerHeight
    const scrolled = -rect.top
    const progress = Math.max(0, Math.min(1, scrolled / totalH))
    const frame = Math.round(progress * (TOTAL_FRAMES - 1))

    if (frame !== currentFrame.current) {
      currentFrame.current = frame
      drawFrame(frame)
      const f1 = frame + 1  // 1-based for overlays
      setDisplayFrame(f1)
      onFrameChange?.(f1)

      const newActive = new Set()
      OVERLAY_CONFIG.forEach(c => {
        if (f1 >= c.from && f1 <= c.to) {
          c.ids.forEach(id => newActive.add(id))
        }
      })
      setActiveOverlays(newActive)
    }
  }, [drawFrame, onFrameChange])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [resize, onScroll])

  const ov = (id) => `${styles.overlay} ${activeOverlays.has(id) ? styles.visible : ''}`

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* Top & bottom cinematic vignette */}
        <div className={styles.vigTop} />
        <div className={styles.vigBottom} />

        {/* === ACT 1 === */}
        <div className={`${ov('act1')} ${styles.actLabel}`}>
          <p className={styles.actNum}>Act I</p>
          <h2 className={styles.actTitle}>Jojo's Bizarre Adventure</h2>
        </div>
        <div className={`${ov('text1')} ${styles.storyText}`}>
          <p>She moved through the sunlit world like a brushstroke — bold, deliberate, impossible to ignore.</p>
        </div>
        <div className={`${ov('left1')} ${styles.sideQuote} ${styles.left}`}>
          <p>"Every story<br />has a beginning<br />drenched in light."</p>
        </div>

        {/* === ACT 2 === */}
        <div className={`${ov('act2')} ${styles.actLabel}`}>
          <p className={styles.actNum}>Act II</p>
          <h2 className={styles.actTitle}>Jojolion</h2>
        </div>
        <div className={`${ov('text2')} ${styles.storyText}`}>
          <p>The spiral deepened. Eyes wide open yet seeing nothing — caught between two worlds.</p>
        </div>
        <div className={`${ov('right2')} ${styles.sideQuote} ${styles.right}`}>
          <p>"Madness is merely<br />a different kind<br />of clarity."</p>
        </div>

        {/* === TRANSITION === */}
        <div className={`${ov('transition')} ${styles.storyText}`}>
          <p>Then came the silence. The kind that swallows light whole.</p>
        </div>

        {/* === ACT 3 === */}
        <div className={`${ov('act3')} ${styles.actLabel}`}>
          <p className={styles.actNum}>Act III</p>
          <h2 className={styles.actTitle}>Wonder of U</h2>
        </div>
        <div className={`${ov('text3')} ${styles.storyText}`}>
          <p>From darkness, steel. From silence, red fire. Something ancient woke — and it remembered everything.</p>
        </div>
        <div className={`${ov('left3')} ${styles.sideQuote} ${styles.left}`}>
          <p>"In the darkest night,<br />the eyes that glow brightest<br />are the hungriest."</p>
        </div>

        {/* === FINAL === */}
        <div className={`${ov('final')} ${styles.storyText}`}>
          <p>The guardian stood. The reckoning had arrived.</p>
        </div>
      </div>
    </section>
  )
}
