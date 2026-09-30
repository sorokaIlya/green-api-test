const MIN_PHONE_DIGITS = 11
const MAX_PHONE_DIGITS = 15 // E.164

/**
 * Приводит введённый номер к цифрам в международном формате.
 * Российский номер с ведущей 8 (8 999 …) заменяется на 7. Возвращает null, если номер некорректный.
 */
export const normalizePhone = (input: string) => {
  const digits = input.replace(/\D/g, '')
  const normalized = digits.length === 11 && digits.startsWith('8') ? `7${digits.slice(1)}` : digits
  if (normalized.length < MIN_PHONE_DIGITS || normalized.length > MAX_PHONE_DIGITS) return null
  return normalized
}

export const displayPhone = (digits: string) =>
  digits.length === 11 && digits.startsWith('7')
    ? digits.replace(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 $1 $2-$3-$4')
    : `+${digits}`

export const initialsFor = (phone: string) => phone.replace(/\D/g, '').slice(-2) || 'Н'

export const formatTime = (timestamp: number) =>
  new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(timestamp)

export const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(timestamp)
