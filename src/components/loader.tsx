import styles from './loader.module.css'

export function Loader() {
  return (
    <div className={styles.screen} role="status" aria-label="Загрузка">
      <span className={styles.spinner} />
    </div>
  )
}
