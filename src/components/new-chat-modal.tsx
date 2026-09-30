import { observer } from 'mobx-react-lite'
import { createChatByPhone } from '../use-cases/create-chat-by-phone'
import { useStores } from '../stores/stores-context'
import { Icon } from './icon'
import formStyles from './form.module.css'
import styles from './modal.module.css'

export const NewChatModal = observer(function NewChatModal() {
  const { chatStore, uiStore } = useStores()

  return (
    <div className={styles.modalBackdrop} onMouseDown={() => uiStore.closeNewChat()}>
      <form
        className={styles.modal}
        onSubmit={(event) => {
          event.preventDefault()
          void createChatByPhone(chatStore, uiStore)
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h2>Новый чат</h2>
            <p>Введите номер получателя в международном формате</p>
          </div>
          <button type="button" onClick={() => uiStore.closeNewChat()} aria-label="Закрыть">
            <Icon name="close" size={23} />
          </button>
        </div>
        <label className={formStyles.fieldLabel}>
          Номер телефона
          <input
            autoFocus
            value={uiStore.newPhone}
            onChange={(event) => uiStore.setNewPhone(event.target.value)}
            placeholder="+7 999 123-45-67"
            inputMode="tel"
          />
        </label>
        <button className={formStyles.primaryButton} disabled={uiStore.isCreatingChat}>
          {uiStore.isCreatingChat ? 'Проверяем номер…' : 'Создать чат'}
        </button>
      </form>
    </div>
  )
})
