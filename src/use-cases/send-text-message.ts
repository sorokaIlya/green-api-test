import { getApiError } from '../api/green-api'
import type { ChatStore } from '../stores/chat-store'
import type { ChatUiStore } from '../stores/chat-ui-store'

/** Use-case отправки текста в открытый чат: UI store даёт ввод и чат, ChatStore — доменные операции и API. */
export async function sendTextMessage(chatStore: ChatStore, uiStore: ChatUiStore) {
  const text = uiStore.draft.trim()
  const chat = uiStore.activeChat
  if (!text || !chat) return

  const messageId = chatStore.addOutgoingMessage(chat.id, text)
  uiStore.clearDraft()
  uiStore.setSending(true)
  uiStore.setNotice(null)

  try {
    await chatStore.sendText(chat.remoteChatId, text)
    chatStore.updateMessageStatus(chat.id, messageId, 'sent')
  } catch (error) {
    chatStore.updateMessageStatus(chat.id, messageId, 'failed')
    uiStore.setNotice({ type: 'error', text: getApiError(error) })
  } finally {
    uiStore.setSending(false)
  }
}
