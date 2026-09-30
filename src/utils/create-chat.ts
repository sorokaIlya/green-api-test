import type { Chat } from '../types'
import { displayPhone, initialsFor } from './chat-format'

const DEFAULT_AVATAR_COLOR = 'linear-gradient(145deg, #3ec5e9, #2c78f0)'

/** Локальный id чата однозначно определяется номером, поэтому по нему можно найти уже созданный чат. */
export const chatIdForPhone = (phoneDigits: string) => `chat-${phoneDigits}`

type CreateChatParams = {
  phoneDigits: string
  remoteChatId: string
  username?: string
}

/** Собирает новый пустой чат из номера и данных, которые вернул checkAccount. */
export const createChat = ({ phoneDigits, remoteChatId, username }: CreateChatParams): Chat => {
  const phone = displayPhone(phoneDigits)
  return {
    id: chatIdForPhone(phoneDigits),
    phone,
    remoteChatId,
    name: username || phone,
    username,
    initials: username
      ? username.replace(/^@/, '').slice(0, 2).toUpperCase()
      : initialsFor(phoneDigits),
    color: DEFAULT_AVATAR_COLOR,
    messages: [],
  }
}
