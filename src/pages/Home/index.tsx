import IllustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import googleIconImg from '../../assets/images/google-icon.svg'
import '../../styles/auth.scss'
import Button from '../../components/Button'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState, FormEvent } from 'react'
import { database } from '../../services/firebase'
// import { toast } from 'react-toastify'
import {toast} from 'react-hot-toast'
export default function Home() {

    const history = useHistory()
    const { user, signInWithGoogle } = useAuth()
    const [roomCode,setRoomCode] = useState('')

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
            return
        }

        history.push('/rooms/new')
    }

    async function handleJoinRoom(e:FormEvent) {
      e.preventDefault()
      if(roomCode.trim() === ''){
          toast.error('Preencher Código da sala!')
          return
      }
      
      const result = await database.ref(`rooms/${roomCode}`).get()

      if(!result.exists()){
          alert('sala nao existe')
          return
      }

      history.push(`/rooms/${roomCode}`)

    }

    return (
        <div id="page-auth">
            <aside>
                <img src={IllustrationImg} alt="" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">Ou entre em uma sala</div>
                    <form>
                        <input type="text"
                            placeholder="Digite o código da sala"
                            onChange={e => setRoomCode(e.target.value)}
                            value={roomCode}
                        />

                        <Button type="submit" onClick={handleJoinRoom}>
                            Entrar na sala
                        </Button>

                    </form>
                </div>
            </main>
        </div>
    )
}