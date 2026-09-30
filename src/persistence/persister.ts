import { makePersistable } from 'mobx-persist-store'
import type { Persistable, StorageAdapter } from './types'

/** Восстанавливает сторы из хранилища и сохраняет их изменения. Только здесь используется mobx-persist-store. */
export class Persister {
  constructor(private readonly storage: StorageAdapter) {}

  /** Завершается, когда данные восстановлены в стор и дальше сохраняются. */
  async restore<T extends Persistable<T>>(store: T): Promise<void> {
    const { key, properties } = store.persistOptions
    await makePersistable(store, { name: key, properties: [...properties], storage: this.storage })
  }
}
