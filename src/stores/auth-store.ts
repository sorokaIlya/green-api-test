import { makeAutoObservable } from 'mobx'
import type { GreenApiService } from '../api/green-api'
import type { GreenApiConfig } from '../api/green-api-types'
import type { PersistOptions, Persistable } from '../persistence/types'

export class AuthStore implements Persistable<AuthStore> {
  readonly persistOptions: PersistOptions<AuthStore> = { key: 'Auth', properties: ['credentials'] }
  credentials: GreenApiConfig | null = null

  constructor(private readonly api: GreenApiService) {
    makeAutoObservable(this, { persistOptions: false }, { autoBind: true })
  }

  get isAuthorized() {
    return this.credentials !== null
  }

  async signIn(credentials: GreenApiConfig) {
    const result = await this.api.setSettings(
      { webhookUrl: '', incomingWebhook: 'yes' },
      credentials,
    )
    if (result.saveSettings !== true) throw new Error('GREEN-API не подтвердил сохранение настроек')
    this.setCredentials(credentials)
  }

  signOut() {
    this.credentials = null
  }

  private setCredentials(credentials: GreenApiConfig) {
    this.credentials = credentials
  }
}
