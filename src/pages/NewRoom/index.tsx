import IllustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import '../../styles/auth.scss'
import Button from '../../components/Button'
import { Link,useHistory } from 'react-router-dom'
import { FormEvent, useState} from 'react'
import { database } from '../../services/firebase'
import { useAuth } from '../../hooks/useAuth'

export default function NewRoom() {

    const {user} = useAuth()
    const [newRoom, setNewRoom] = useState('')
    const history = useHistory()

    async function handleCreateRoom(e: FormEvent) {
        e.preventDefault()
        if (newRoom.trim() === '') {
            console.log('vazio');
            return
        }

        const result = await database.ref('rooms').push({
            title:newRoom,
            authId:user?.id
        })

        if(result.key){
            history.push(`/rooms/${result.key}`)
        }
        

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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input type="text"
                            placeholder="Nome da sala"
                            onChange={e => setNewRoom(e.target.value)}
                            value={newRoom}
                        />

                        <Button type="submit">
                            Criar sala
                        </Button>

                    </form>
                    <p>
                        Quer entrar em uma sala existente?
                        <Link to="/">Clique aqui</Link>
                        `
                    </p>
                </div>
            </main>
        </div>
    )
}