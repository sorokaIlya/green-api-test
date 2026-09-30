import { observer } from 'mobx-react-lite'
import { ChatWorkspace } from './chat-workspace'
import { LoginScreen } from './login-screen'
import { Notice } from './notice'
import { useStores } from '../stores/stores-context'

export const ChatRoot = observer(function ChatRoot() {
  const { authStore } = useStores()

  return (
    <>
      {authStore.isAuthorized ? <ChatWorkspace /> : <LoginScreen />}
      <Notice />
    </>
  )
})
