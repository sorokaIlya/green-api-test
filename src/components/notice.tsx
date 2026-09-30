import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useStores } from '../stores/stores-context'
import { Icon } from './icon'
import styles from './notice.module.css'

const HIDE_DELAY_MS = { success: 3000, error: 6000 }

export const Notice = observer(function Notice() {
  const { uiStore } = useStores()
  const { notice } = uiStore

  // Уведомление закрывается само, чтобы не перекрывать шапку со кнопкой создания чата.
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => uiStore.setNotice(null), HIDE_DELAY_MS[notice.type])
    return () => clearTimeout(timer)
  }, [notice, uiStore])

  if (!notice) return null

  return (
    <button
      className={`${styles.notice} ${notice.type === 'error' ? styles.noticeError : ''}`}
      onClick={() => uiStore.setNotice(null)}
    >
      {notice.type === 'success' ? (
        <Icon name="check" size={18} />
      ) : (
        <Icon name="close" size={18} />
      )}
      {notice.text}
    </button>
  )
})
