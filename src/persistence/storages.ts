import type { StorageAdapter } from './types'

/** Хранилище в памяти: для тестов и окружений без window (SSR). */
export const createMemoryStorage = (): StorageAdapter => {
  const items = new Map<string, string>()
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => {
      items.set(key, value)
    },
    removeItem: (key) => {
      items.delete(key)
    },
  }
}

/** В браузере localStorage, вне браузера — память. */
export const createBrowserStorage = (): StorageAdapter =>
  typeof window === 'undefined' ? createMemoryStorage() : window.localStorage
