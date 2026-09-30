import { getApiError } from '../api/green-api'
import type { ChatStore } from '../stores/chat-store'
import type { ChatUiStore } from '../stores/chat-ui-store'
import { normalizePhone } from '../utils/chat-format'
import { chatIdForPhone, createChat } from '../utils/create-chat'

/**
 * Use-case создания чата по номеру телефона из формы нового чата.
 * Если чат с этим номером уже есть, он просто открывается — без повторного checkAccount.
 */
export async function createChatByPhone(chatStore: ChatStore, uiStore: ChatUiStore) {
  const phoneDigits = normalizePhone(uiStore.newPhone)
  if (!phoneDigits) {
    uiStore.setNotice({ type: 'error', text: 'Введите номер в международном формате' })
    return
  }

  const openChat = (id: string) => {
    uiStore.selectChat(id)
    chatStore.markChatAsRead(id)
    uiStore.closeNewChat()
  }

  const existingChat = chatStore.getChatById(chatIdForPhone(phoneDigits))
  if (existingChat) {
    openChat(existingChat.id)
    return
  }

  uiStore.setCreatingChat(true)
  uiStore.setNotice(null)
  try {
    const account = await chatStore.resolveRecipient(phoneDigits)
    if (!account.exist || !account.chatId)
      throw new Error('У этого номера нет аккаунта в мессенджере')

    const chat = createChat({
      phoneDigits,
      remoteChatId: account.chatId,
      username: account.username,
    })
    chatStore.addChat(chat)
    openChat(chat.id)
    uiStore.setNotice({ type: 'success', text: 'Чат создан' })
  } catch (error) {
    uiStore.setNotice({ type: 'error', text: getApiError(error) })
  } finally {
    uiStore.setCreatingChat(false)
  }
}
