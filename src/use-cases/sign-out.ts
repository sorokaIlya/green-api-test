import type { AuthStore } from '../stores/auth-store'
import type { ChatStore } from '../stores/chat-store'
import type { ChatUiStore } from '../stores/chat-ui-store'

/** Use-case выхода: останавливает приём, удаляет историю и учётные данные, сбрасывает UI. */
export function signOut(authStore: AuthStore, chatStore: ChatStore, uiStore: ChatUiStore) {
  chatStore.clear()
  authStore.signOut()
  uiStore.reset()
  uiStore.setNotice(null)
}
