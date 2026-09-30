/** Учётные данные инстанса GREEN-API. */
export type GreenApiConfig = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type GreenApiSettings = {
  webhookUrl?: string
  incomingWebhook?: 'yes' | 'no'
}

export type SetSettingsResponse = {
  saveSettings?: boolean
}

export type CheckAccountResponse = {
  exist?: boolean
  chatId?: string
  status?: boolean
  reason?: string
  fromCache?: boolean
  phoneNumber?: number
  username?: string
}

export type SendMessageResponse = {
  idMessage?: string
}

export type DeleteNotificationResponse = {
  result?: boolean
}

export type IncomingNotification = {
  receiptId?: number
  body?: {
    typeWebhook?: string
    timestamp?: number
    idMessage?: string
    senderData?: {
      chatId?: string
      chatName?: string
      senderName?: string
      senderPhoneNumber?: number
    }
    messageData?: {
      typeMessage?: string
      textMessageData?: { textMessage?: string }
    }
  }
}
