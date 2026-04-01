import styles from './Intro.module.css'

export default function Intro() {
  return (
    <section className={styles.intro}>
      <div className={styles.glow} />
      <p className={styles.subtitle}>A scrollytelling experience</p>
      <h1 className={styles.title}>The Awakening</h1>
      <p className={styles.desc}>
        From vibrant streets to shadow's embrace —<br />scroll to unravel the descent.
      </p>
      <div className={styles.scrollCue}>
        <span>Scroll to begin</span>
        <div className={styles.scrollArrow} />
      </div>
    </section>
  )
}
