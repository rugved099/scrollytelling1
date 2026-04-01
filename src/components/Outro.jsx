import styles from './Outro.module.css'

export default function Outro() {
  return (
    <section className={styles.outro}>
      <div className={styles.glow} />
      <p className={styles.sub}>Epilogue</p>
      <h2 className={styles.title}>
        What Rises<br />Cannot Fall Again
      </h2>
      <div className={styles.divider} />
      <p className={styles.body}>
        Every awakening carries a price. The light that once painted her world
        now fuels the furnace of something far older than memory.
        The story does not end here — it transforms.
      </p>
      <div className={styles.glyph}>☽</div>
    </section>
  )
}
