import { useState, useEffect, useRef, useCallback } from 'react'
import './index.css'
import Loader from './components/Loader'
import Intro from './components/Intro'
import AnimationCanvas from './components/AnimationCanvas'
import Outro from './components/Outro'
import styles from './App.module.css'

const TOTAL_FRAMES = 240

function frameSrc(n) {
  return '/frames/ezgif-frame-' + String(n).padStart(3, '0') + '.png'
}

export default function App() {
  const imagesRef   = useRef(new Array(TOTAL_FRAMES).fill(null))
  const [loaded, setLoaded]     = useState(0)
  const [ready, setReady]       = useState(false)
  const [frame, setFrame]       = useState(1)

  // Preload all frames
  useEffect(() => {
    let count = 0
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = frameSrc(i)
      img.onload = img.onerror = () => {
        count++
        setLoaded(count)
      }
      imagesRef.current[i - 1] = img
    }
  }, [])

  const handleLoaderDone = useCallback(() => setReady(true), [])

  // Progress bar
  const pageProgress = useCallback(() => {
    const h = document.documentElement.scrollHeight - window.innerHeight
    return h > 0 ? (window.scrollY / h) * 100 : 0
  }, [])
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => setProgress(pageProgress())
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pageProgress])

  return (
    <>
      {/* Loading screen */}
      {!ready && (
        <Loader
          progress={loaded}
          total={TOTAL_FRAMES}
          onDone={handleLoaderDone}
        />
      )}

      {/* Fixed progress bar */}
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />

      {/* Fixed frame counter */}
      <div className={styles.frameCounter}>
        FRAME {String(frame).padStart(3, '0')} / {TOTAL_FRAMES}
      </div>

      <main>
        <Intro />
        <AnimationCanvas
          images={imagesRef.current}
          onFrameChange={setFrame}
        />
        <Outro />
      </main>
    </>
  )
}
