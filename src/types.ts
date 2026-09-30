export type Message = {
  id: string
  text: string
  direction: 'incoming' | 'outgoing'
  timestamp: number
  status?: 'sent' | 'sending' | 'failed'
}

export type Chat = {
  id: string
  phone: string
  /** Идентификатор чата на стороне провайдера (chatId из checkAccount, например 79991234567@c.us). */
  remoteChatId: string
  name: string
  username?: string
  initials: string
  color: string
  messages: Message[]
  unread?: number
}
