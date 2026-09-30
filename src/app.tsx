import { ChatRoot } from './components/chat-root'
import { Loader } from './components/loader'
import { StoresProvider } from './stores/stores-context'

export default function App() {
  return (
    <StoresProvider fallback={<Loader />}>
      <ChatRoot />
    </StoresProvider>
  )
}
