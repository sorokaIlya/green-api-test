import { getApiError } from '../api/green-api'
import type { AuthStore } from '../stores/auth-store'
import type { ChatUiStore } from '../stores/chat-ui-store'

/**
 * Use-case входа: передаёт учётные данные из формы в AuthStore.
 * Экран чатов откроется, только если GREEN-API принял эти данные.
 */
export async function signIn(authStore: AuthStore, uiStore: ChatUiStore) {
  const { apiUrl, idInstance, apiTokenInstance } = uiStore.credentialsDraft
  uiStore.setSigningIn(true)
  uiStore.setNotice(null)
  try {
    await authStore.signIn({
      apiUrl: apiUrl.trim(),
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    })
  } catch (error) {
    uiStore.setNotice({ type: 'error', text: getApiError(error) })
  } finally {
    uiStore.setSigningIn(false)
  }
}
