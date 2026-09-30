import { GreenApiService } from '../api/green-api'
import { Persister } from '../persistence/persister'
import type { StorageAdapter } from '../persistence/types'
import { AuthStore } from './auth-store'
import { ChatStore } from './chat-store'
import { ChatUiStore } from './chat-ui-store'

export type RootStoreDeps = {
  /** Где хранить сессию и историю: localStorage в браузере, память в тестах. */
  storage: StorageAdapter
}

/**
 * Composition root: конструктор только создаёт зависимости и связывает их, без побочных эффектов.
 * Восстановление сохранённого состояния — в init().
 */
export class RootStore {
  readonly api: GreenApiService
  readonly authStore: AuthStore
  readonly chatStore: ChatStore
  readonly uiStore: ChatUiStore

  private readonly persister: Persister
  private initialization?: Promise<void>

  constructor({ storage }: RootStoreDeps) {
    this.persister = new Persister(storage)
    this.api = new GreenApiService(() => this.authStore.credentials)
    this.authStore = new AuthStore(this.api)
    this.chatStore = new ChatStore(this.api, {
      onApiError: (text) => this.uiStore.setNotice({ type: 'error', text }),
      getActiveRemoteChatId: () => this.uiStore.activeChat?.remoteChatId,
    })
    this.uiStore = new ChatUiStore(this.chatStore)
  }

  /** Восстанавливает сохранённые сторы. Повторный вызов возвращает тот же промис. */
  init() {
    this.initialization ??= this.restorePersistedStores()
    return this.initialization
  }

  private async restorePersistedStores() {
    await Promise.all([
      this.persister.restore(this.authStore),
      this.persister.restore(this.chatStore),
    ])
  }
}
