import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { ChatList } from './chat-list'
import { Conversation } from './conversation'
import { NewChatModal } from './new-chat-modal'
import { SideRail } from './side-rail'
import { useStores } from '../stores/stores-context'
import styles from './chat-workspace.module.css'

export const ChatWorkspace = observer(function ChatWorkspace() {
  const { chatStore, uiStore } = useStores()

  // Входящие принимаются, пока открыт экран чатов: после входа и до выхода.
  useEffect(() => {
    chatStore.startPolling()
    return () => chatStore.stopPolling()
  }, [chatStore])

  return (
    <main className={styles.app}>
      <SideRail />
      <ChatList />
      <Conversation />
      {uiStore.isNewChatOpen && <NewChatModal />}
    </main>
  )
})
