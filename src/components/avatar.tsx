import styles from './avatar.module.css'

export function Avatar({
  initials,
  color,
  size = 'medium',
}: {
  initials: string
  color: string
  size?: 'small' | 'medium' | 'large'
}) {
  return (
    <div className={`${styles.avatar} ${styles[size]}`} style={{ background: color }}>
      {initials}
    </div>
  )
}
