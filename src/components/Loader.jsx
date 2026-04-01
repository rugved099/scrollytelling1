import { useEffect, useRef } from 'react'
import styles from './Loader.module.css'

export default function Loader({ progress, total, onDone }) {
  const pct = total > 0 ? (progress / total) * 100 : 0
  const done = progress >= total && total > 0

  useEffect(() => {
    if (done) {
      const t = setTimeout(onDone, 400)
      return () => clearTimeout(t)
    }
  }, [done, onDone])

  return (
    <div className={`${styles.loader} ${done ? styles.hidden : ''}`}>
      <div className={styles.spinner} />
      <h2 className={styles.title}>Loading the Story…</h2>
      <div className={styles.barWrap}>
        <div className={styles.bar} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.count}>{progress} / {total}</p>
    </div>
  )
}
