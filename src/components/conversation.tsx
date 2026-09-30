import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { sendTextMessage } from '../use-cases/send-text-message'
import { useStores } from '../stores/stores-context'
import { formatTime } from '../utils/chat-format'
import { Avatar } from './avatar'
import { Icon } from './icon'
import styles from './conversation.module.css'

export const Conversation = observer(function Conversation() {
  const { chatStore, uiStore } = useStores()
  const chat = uiStore.activeChat
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages.length])

  if (!chat)
    return (
      <section className={styles.conversation}>
        <div className={styles.messageArea}>
          <div className={styles.wallpaper} />
          <div className={styles.messages}>
            <div className={styles.emptyConversation}>
              <div className={styles.emptyIcon}>
                <Icon name="chat" size={29} />
              </div>
              <strong>Нет открытого чата</strong>
              <span>Создайте чат по номеру телефона получателя</span>
            </div>
          </div>
        </div>
      </section>
    )

  return (
    <section className={styles.conversation}>
      <header className={styles.conversationHeader}>
        <button className={styles.backButton} aria-label="Назад">
          <Icon name="arrow" size={26} />
        </button>
        <Avatar initials={chat.initials} color={chat.color} size="large" />
        <div className={styles.contactInfo}>
          <strong>{chat.name}</strong>
          <span>
            {chat.phone} {chatStore.isPolling && <i className={styles.onlineDot} />}
          </span>
        </div>
        <button className={styles.headerAction} aria-label="Поиск">
          <Icon name="search" size={27} />
        </button>
      </header>
      <div className={styles.messageArea}>
        <div className={styles.wallpaper} />
        <div className={styles.messages}>
          {chat.messages.length === 0 && (
            <div className={styles.emptyConversation}>
              <div className={styles.emptyIcon}>
                <Icon name="chat" size={29} />
              </div>
              <strong>Новый чат</strong>
              <span>Отправьте первое сообщение</span>
            </div>
          )}
          {chat.messages.map((message, index) => (
            <div
              key={message.id}
              className={`${styles.messageRow} ${message.direction === 'outgoing' ? styles.messageRowOutgoing : ''}`}
            >
              <div
                className={`${styles.messageBubble} ${message.direction === 'outgoing' ? styles.messageBubbleOutgoing : ''}`}
              >
                <span>{message.text}</span>
                <small>
                  {formatTime(message.timestamp)}{' '}
                  {message.direction === 'outgoing' && (
                    <em className={message.status === 'failed' ? styles.failed : ''}>
                      {message.status === 'sending'
                        ? '·'
                        : message.status === 'failed'
                          ? '!'
                          : '✓✓'}
                    </em>
                  )}
                </small>
              </div>
              {index === chat.messages.length - 1 && <span className={styles.tail} />}
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
        <form
          className={styles.composer}
          onSubmit={(event) => {
            event.preventDefault()
            void sendTextMessage(chatStore, uiStore)
          }}
        >
          <button type="button" className={styles.composerIcon} aria-label="Прикрепить файл">
            <Icon name="paperclip" size={24} />
          </button>
          <input
            value={uiStore.draft}
            onChange={(event) => uiStore.setDraft(event.target.value)}
            placeholder="Сообщение"
            maxLength={4096}
            aria-label="Текст сообщения"
          />
          <button type="button" className={styles.composerIcon} aria-label="Смайлик">
            <Icon name="smile" size={24} />
          </button>
          {uiStore.draft.trim() ? (
            <button
              type="submit"
              className={styles.sendButton}
              disabled={uiStore.isSending}
              aria-label="Отправить"
            >
              <Icon name="send" size={24} />
            </button>
          ) : (
            <button type="button" className={styles.composerIcon} aria-label="Голосовое сообщение">
              <Icon name="mic" size={24} />
            </button>
          )}
        </form>
      </div>
    </section>
  )
})
