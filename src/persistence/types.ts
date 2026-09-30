/** Любое key-value хранилище. localStorage и sessionStorage подходят как есть. */
export interface StorageAdapter {
  getItem(key: string): string | null | Promise<string | null>
  setItem(key: string, value: string): void | Promise<void>
  removeItem(key: string): void | Promise<void>
}

export type PersistOptions<T> = {
  /** Ключ, под которым состояние лежит в хранилище. */
  key: string
  /** Поля стора, которые сохраняются и восстанавливаются. */
  properties: readonly (keyof T & string)[]
}

/** Контракт стора, состояние которого восстанавливается из хранилища. */
export interface Persistable<T> {
  readonly persistOptions: PersistOptions<T>
}
