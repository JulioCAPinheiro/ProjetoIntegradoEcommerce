import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/Nav'


const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children }) {
  const { data: session } = useSession();
  if (!session) {
    return (
      <form className='form'>
        <div className="login-container">
          
          <input type="text" placeholder="Usuário" requird />
          <input type="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>

          <div className='loginGoogle'>
            <button onClick={() => signIn('google')}>Login With Google</button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <div className='layout min-h-screen flex'>
      <Nav />
      <div className='bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4'>
        {children}
      </div>
    </div>
  );

}
