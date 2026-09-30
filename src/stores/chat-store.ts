import { makeAutoObservable } from 'mobx'
import { getApiError, type GreenApiService } from '../api/green-api'
import type { IncomingNotification } from '../api/green-api-types'
import type { PersistOptions, Persistable } from '../persistence/types'
import type { Chat, Message } from '../types'
import { sleep } from '../utils/sleep'

const POLL_INTERVAL_MS = 300
const MAX_POLL_BACKOFF_MS = 30_000

/** Пауза между запросами: 300 мс, после ошибок растёт экспоненциально до 30 с. */
const pollDelay = (errorCount: number) =>
  Math.min(POLL_INTERVAL_MS * 2 ** errorCount, MAX_POLL_BACKOFF_MS)

export type ChatStoreOptions = {
  onApiError?: (message: string) => void
  getActiveRemoteChatId?: () => string | undefined
}

export class ChatStore implements Persistable<ChatStore> {
  readonly persistOptions: PersistOptions<ChatStore> = { key: 'Chats', properties: ['chats'] }
  chats: Chat[] = []
  isPolling = false

  private pollController?: AbortController

  constructor(
    private readonly api: GreenApiService,
    private readonly options: ChatStoreOptions = {},
  ) {
    makeAutoObservable<ChatStore, 'options' | 'pollController'>(
      this,
      { options: false, pollController: false, persistOptions: false },
      { autoBind: true },
    )
  }

  getChatById(id: string) {
    return this.chats.find((chat) => chat.id === id)
  }

  getVisibleChats(search: string) {
    const query = search.toLowerCase()
    return this.chats.filter((chat) => `${chat.name} ${chat.phone}`.toLowerCase().includes(query))
  }

  /** Останавливает приём и удаляет локальную историю (при выходе). */
  clear() {
    this.stopPolling()
    this.chats = []
  }

  async resolveRecipient(phoneNumber: string) {
    return this.api.checkAccount(phoneNumber)
  }

  async sendText(remoteChatId: string, text: string) {
    await this.api.sendText(remoteChatId, text)
  }

  /** Добавляет новый чат в начало списка; существующий чат с тем же id не перезаписывается. */
  addChat(chat: Chat) {
    if (this.getChatById(chat.id)) return
    this.chats.unshift(chat)
  }

  markChatAsRead(id: string) {
    const chat = this.getChatById(id)
    if (chat?.unread) chat.unread = 0
  }

  /** Добавляет исходящее сообщение со статусом «отправляется» и возвращает его id. */
  addOutgoingMessage(chatId: string, text: string) {
    const id = crypto.randomUUID()
    this.getChatById(chatId)?.messages.push({
      id,
      text,
      direction: 'outgoing',
      timestamp: Date.now(),
      status: 'sending',
    })
    return id
  }

  updateMessageStatus(chatId: string, messageId: string, status: Message['status']) {
    const message = this.getChatById(chatId)?.messages.find((item) => item.id === messageId)
    if (message) message.status = status
  }

  /** Запускает приём входящих (перезапускает, если уже идёт). */
  startPolling() {
    this.stopPolling()
    if (!this.api.hasCredentials) return
    const controller = new AbortController()
    this.pollController = controller
    this.isPolling = true
    void this.pollLoop(controller.signal)
  }

  stopPolling() {
    this.pollController?.abort()
    this.pollController = undefined
    this.isPolling = false
  }

  /** Цикл long polling: работает, пока signal не отменён. */
  private async pollLoop(signal: AbortSignal) {
    let errorCount = 0
    while (!signal.aborted) {
      try {
        const notification = await this.api.receiveNotification(signal)
        if (signal.aborted) return
        if (notification?.body) {
          this.handleNotification(notification)
          if (notification.receiptId !== undefined)
            await this.api.deleteNotification(notification.receiptId)
        }
        errorCount = 0
      } catch (error) {
        if (signal.aborted) return
        // Показываем ошибку один раз за серию, чтобы не спамить уведомлениями.
        if (errorCount === 0) this.options.onApiError?.(getApiError(error))
        errorCount += 1
      }
      await sleep(pollDelay(errorCount), signal)
    }
  }

  private handleNotification(notification: IncomingNotification) {
    const body = notification.body
    if (!body) return
    // По заданию поддерживаются только текстовые сообщения, остальные типы пропускаем.
    const isIncomingText =
      body.typeWebhook === 'incomingMessageReceived' &&
      body.messageData?.typeMessage === 'textMessage'
    const text = body.messageData?.textMessageData?.textMessage
    const remoteChatId = body.senderData?.chatId
    if (isIncomingText && text && remoteChatId)
      this.appendIncomingMessage(remoteChatId, {
        id: body.idMessage || crypto.randomUUID(),
        text,
        direction: 'incoming',
        timestamp: (body.timestamp || Date.now() / 1000) * 1000,
      })
  }

  private appendIncomingMessage(remoteChatId: string, message: Message) {
    const chat = this.chats.find((item) => item.remoteChatId === remoteChatId)
    if (!chat || chat.messages.some((item) => item.id === message.id)) return
    chat.messages.push(message)
    if (this.options.getActiveRemoteChatId?.() !== remoteChatId)
      chat.unread = (chat.unread ?? 0) + 1
  }
}
