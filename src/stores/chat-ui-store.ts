import { makeAutoObservable } from 'mobx'
import { initialGreenApiConfig } from '../api/green-api'
import type { GreenApiConfig } from '../api/green-api-types'
import type { ChatStore } from './chat-store'

export type Notice = { type: 'error' | 'success'; text: string }

export class ChatUiStore {
  activeChatId = ''
  search = ''
  draft = ''
  newPhone = ''
  /** Поля формы входа: в ChatStore попадают только по «Войти». */
  credentialsDraft: GreenApiConfig
  isNewChatOpen = false
  notice: Notice | null = null
  isSending = false
  isCreatingChat = false
  isSigningIn = false

  constructor(private readonly chatStore: ChatStore) {
    this.credentialsDraft = { ...initialGreenApiConfig }
    makeAutoObservable(this, {}, { autoBind: true })
  }

  /** Открытый чат; если ничего не выбрано, открыт первый чат в списке. */
  get activeChat() {
    return this.chatStore.getChatById(this.activeChatId) ?? this.chatStore.chats[0]
  }

  setSearch(value: string) {
    this.search = value
  }

  setDraft(value: string) {
    this.draft = value
  }

  clearDraft() {
    this.draft = ''
  }

  setNewPhone(value: string) {
    this.newPhone = value
  }

  setCredentialsField(field: keyof GreenApiConfig, value: string) {
    this.credentialsDraft[field] = value
  }

  selectChat(id: string) {
    this.activeChatId = id
  }

  setNotice(notice: Notice | null) {
    this.notice = notice
  }

  setSending(value: boolean) {
    this.isSending = value
  }

  setCreatingChat(value: boolean) {
    this.isCreatingChat = value
  }

  setSigningIn(value: boolean) {
    this.isSigningIn = value
  }

  openNewChat() {
    this.isNewChatOpen = true
  }

  closeNewChat() {
    this.isNewChatOpen = false
    this.newPhone = ''
  }

  /** Сбрасывает UI-состояние после выхода. */
  reset() {
    this.activeChatId = ''
    this.search = ''
    this.draft = ''
    this.isNewChatOpen = false
    this.newPhone = ''
    this.credentialsDraft = { ...initialGreenApiConfig }
  }
}
