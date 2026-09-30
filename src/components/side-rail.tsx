import { signOut } from '../use-cases/sign-out'
import { useStores } from '../stores/stores-context'
import { Icon } from './icon'
import styles from './side-rail.module.css'

export function SideRail() {
  const { authStore, chatStore, uiStore } = useStores()

  return (
    <aside className={styles.rail}>
      <button className={`${styles.railItem} ${styles.railItemActive}`} aria-label="Чаты">
        <Icon name="chat" size={25} />
        <span>Все</span>
      </button>
      <button className={styles.railItem} aria-label="Новые">
        <Icon name="folder" size={25} />
        <span>Новые</span>
      </button>
      <button className={styles.railItem} aria-label="Каналы">
        <Icon name="channel" size={25} />
        <span>Каналы</span>
      </button>
      <div className={styles.railDivider} />
      <button className={styles.railItem} aria-label="Контакты">
        <Icon name="contacts" size={25} />
        <span>Контакты</span>
      </button>
      <button className={styles.railItem} aria-label="Звонки">
        <Icon name="phone" size={25} />
        <span>Звонки</span>
      </button>
      <button
        className={`${styles.railItem} ${styles.railBottom}`}
        aria-label="Выйти"
        onClick={() => signOut(authStore, chatStore, uiStore)}
      >
        <Icon name="arrow" size={25} />
        <span>Выйти</span>
      </button>
    </aside>
  )
}
