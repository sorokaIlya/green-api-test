import { observer } from 'mobx-react-lite'
import { useStores } from '../stores/stores-context'
import { formatDate } from '../utils/chat-format'
import { Avatar } from './avatar'
import { Icon } from './icon'
import styles from './chat-list.module.css'

export const ChatList = observer(function ChatList() {
  const { chatStore, uiStore } = useStores()
  const chats = chatStore.getVisibleChats(uiStore.search)
  const activeChat = uiStore.activeChat

  return (
    <section className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h1>Чаты</h1>
        <button
          className={styles.newChatButton}
          onClick={() => uiStore.openNewChat()}
          aria-label="Создать чат"
        >
          <Icon name="plus" size={36} />
        </button>
      </div>
      <label className={styles.searchBox}>
        <Icon name="search" size={21} />
        <input
          value={uiStore.search}
          onChange={(event) => uiStore.setSearch(event.target.value)}
          placeholder="Найти"
          aria-label="Поиск чатов"
        />
      </label>
      <div className={styles.chatList}>
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1]
          return (
            <button
              key={chat.id}
              className={`${styles.chatRow} ${chat.id === activeChat?.id ? styles.chatRowActive : ''}`}
              onClick={() => {
                uiStore.selectChat(chat.id)
                chatStore.markChatAsRead(chat.id)
              }}
            >
              <Avatar initials={chat.initials} color={chat.color} />
              <span className={styles.chatPreview}>
                <span className={styles.chatTitleLine}>
                  <strong>{chat.name}</strong>
                  <span className={styles.chatMeta}>
                    <time>{lastMessage ? formatDate(lastMessage.timestamp) : 'новый чат'}</time>
                    {!!chat.unread && (
                      <span
                        className={styles.unreadBadge}
                        aria-label={`Непрочитанных: ${chat.unread}`}
                      >
                        {chat.unread > 99 ? '99+' : chat.unread}
                      </span>
                    )}
                  </span>
                </span>
                <span className={styles.chatMessageLine}>
                  {lastMessage?.text || 'Начните переписку'}
                </span>
              </span>
            </button>
          )
        })}
        {chats.length === 0 && (
          <div className={styles.emptySearch}>
            {chatStore.chats.length === 0 ? 'Чатов пока нет' : 'Ничего не найдено'}
          </div>
        )}
      </div>
    </section>
  )
})
