import axios, { AxiosError } from 'axios'
import type {
  CheckAccountResponse,
  DeleteNotificationResponse,
  GreenApiConfig,
  GreenApiSettings,
  IncomingNotification,
  SendMessageResponse,
  SetSettingsResponse,
} from './green-api-types'

const DEFAULT_API_URL = 'https://api.green-api.com/'
const REQUEST_TIMEOUT_MS = 15_000
/** receiveNotification держит соединение до receiveTimeout секунд. */
const RECEIVE_TIMEOUT_S = 5
const RECEIVE_REQUEST_TIMEOUT_MS = 12_000
const NOT_AUTHORIZED_ERROR = 'Сначала войдите: введите idInstance и apiTokenInstance'

export const initialGreenApiConfig: GreenApiConfig = {
  apiUrl: DEFAULT_API_URL,
  idInstance: '',
  apiTokenInstance: '',
}

export type CredentialsProvider = () => GreenApiConfig | null

export class GreenApiService {
  private readonly http = axios.create({ timeout: REQUEST_TIMEOUT_MS })

  constructor(private readonly getCredentials: CredentialsProvider) {}

  get hasCredentials() {
    return this.getCredentials() !== null
  }
  async setSettings(settings: GreenApiSettings, credentials = this.requireCredentials()) {
    const { data } = await this.http.post<SetSettingsResponse>(
      this.url('setSettings', credentials),
      settings,
    )
    return data
  }

  async checkAccount(phoneNumber: string) {
    const { data } = await this.http.post<CheckAccountResponse>(this.url('checkAccount'), {
      phoneNumber: Number(phoneNumber),
    })
    return data
  }

  async sendText(chatId: string, message: string) {
    const { data } = await this.http.post<SendMessageResponse>(this.url('sendMessage'), {
      chatId,
      message,
    })
    return data
  }

  /** Long polling: ждёт уведомление до 5 с. signal позволяет оборвать запрос при остановке опроса. */
  async receiveNotification(signal?: AbortSignal) {
    const { data } = await this.http.get<IncomingNotification | null>(
      this.url('receiveNotification'),
      {
        params: { receiveTimeout: RECEIVE_TIMEOUT_S },
        timeout: RECEIVE_REQUEST_TIMEOUT_MS,
        signal,
      },
    )
    return data
  }

  async deleteNotification(receiptId: number) {
    const { data } = await this.http.delete<DeleteNotificationResponse>(
      `${this.url('deleteNotification')}/${receiptId}`,
    )
    return data
  }

  private requireCredentials() {
    const credentials = this.getCredentials()
    if (!credentials) throw new Error(NOT_AUTHORIZED_ERROR)
    return credentials
  }
  private url(method: string, credentials = this.requireCredentials()) {
    const { apiUrl, idInstance, apiTokenInstance } = credentials
    return `${apiUrl.replace(/\/+$/, '')}/waInstance${idInstance}/${method}/${apiTokenInstance}`
  }
}

export const getApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as { message?: string; reason?: string } | undefined
    return response?.message || response?.reason || error.message
  }
  return error instanceof Error ? error.message : 'Не удалось выполнить запрос'
}
