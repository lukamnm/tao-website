import Link from 'next/link'
import { signUpAction } from '../actions'
import { AuthForm } from '../AuthForm'

export default function SignUpPage() {
  return (
    <AuthForm
      title="Sign up"
      action={signUpAction}
      withName
      footer={
        <>
          Already registered? <Link href="/auth/sign-in">Sign in</Link>
        </>
      }
    />
  )
}
