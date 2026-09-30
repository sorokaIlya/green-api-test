import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createBrowserStorage } from '../persistence/storages'
import { RootStore } from './root-store'

const StoresContext = createContext<RootStore | null>(null)

type StoresProviderProps = {
  children: ReactNode
  /** Позволяет подставить заранее созданные сторы, например в тестах. */
  rootStore?: RootStore
  /** Что показывать, пока сохранённые данные восстанавливаются. */
  fallback?: ReactNode
}

export function StoresProvider({
  children,
  rootStore: providedStore,
  fallback = null,
}: StoresProviderProps) {
  const [rootStore] = useState(
    () => providedStore ?? new RootStore({ storage: createBrowserStorage() }),
  )
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isActive = true
    void rootStore.init().then(() => {
      if (isActive) setIsReady(true)
    })
    return () => {
      isActive = false
    }
  }, [rootStore])

  if (!isReady) return fallback
  return <StoresContext.Provider value={rootStore}>{children}</StoresContext.Provider>
}

export function useStores() {
  const stores = useContext(StoresContext)
  if (!stores) throw new Error('useStores must be used inside StoresProvider')
  return stores
}
