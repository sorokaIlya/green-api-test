import { observer } from 'mobx-react-lite'
import type { GreenApiConfig } from '../api/green-api-types'
import { signIn } from '../use-cases/sign-in'
import { useStores } from '../stores/stores-context'
import formStyles from './form.module.css'
import styles from './login-screen.module.css'

const fields: { name: keyof GreenApiConfig; label: string; type?: string }[] = [
  { name: 'idInstance', label: 'idInstance' },
  { name: 'apiTokenInstance', label: 'apiTokenInstance', type: 'password' },
  { name: 'apiUrl', label: 'API URL' },
]

export const LoginScreen = observer(function LoginScreen() {
  const { authStore, uiStore } = useStores()

  return (
    <main className={styles.screen}>
      <form
        className={styles.card}
        onSubmit={(event) => {
          event.preventDefault()
          void signIn(authStore, uiStore)
        }}
      >
        <h1>Вход</h1>
        <p>Введите учётные данные инстанса из личного кабинета GREEN-API.</p>
        {fields.map(({ name, label, type }, index) => (
          <label key={name} className={formStyles.fieldLabel}>
            {label}
            <input
              required
              autoFocus={index === 0}
              type={type}
              value={uiStore.credentialsDraft[name]}
              onChange={(event) => uiStore.setCredentialsField(name, event.target.value)}
            />
          </label>
        ))}
        <button className={formStyles.primaryButton} disabled={uiStore.isSigningIn}>
          {uiStore.isSigningIn ? 'Подключаемся…' : 'Войти'}
        </button>
      </form>
    </main>
  )
})
