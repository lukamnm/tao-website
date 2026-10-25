import Link from 'next/link'
import { signInAction } from '../actions'
import { AuthForm } from '../AuthForm'

export default function SignInPage() {
  return (
    <AuthForm
      title="Sign in"
      action={signInAction}
      footer={
        <>
          No account yet? <Link href="/auth/sign-up">Sign up</Link>
        </>
      }
    />
  )
}
