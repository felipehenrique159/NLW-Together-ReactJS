import logoImg from '../../assets/images/logo.svg'
import Button from '../../components/Button'
import RoomCode from '../../components/RoomCode'
import '../../styles/room.scss'
import { useParams } from 'react-router-dom'
import { FormEvent, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import { database, firebase } from '../../services/firebase'

type RoomParams = {
    id: string
}

type FirebaseQuestion = Record<string, {
    author: {
        name: string,
        avatar: string
    }
    content: string,
    isHighLighted: boolean
    isAnswered: boolean,
}>

type Question = {
    id: string,
    author: {
        name: string,
        avatar: string
    }
    content: string,
    isHighLighted: boolean
    isAnswered: boolean,
}

export default function Room() {
    const { user } = useAuth()
    const params = useParams<RoomParams>()
    const roomId = params.id
    const [newQuestion, setNewQuestion] = useState('')
    const [title,setTitle] = useState('')
    const [questions, setQuestions] = useState<Question[]>([])


    useEffect(() => {
        async function getQuestions() {
            const roomRef = await database.ref(`rooms/${roomId}`)
            roomRef.on('value', room => {
                // console.log(room.val());
                const databaseRoom = room.val()
                const firebaseQuestions: FirebaseQuestion = databaseRoom.questions ?? {}

                const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                    return {
                        id: key,
                        content: value.content,
                        author: value.author,
                        isAnswered: value.isAnswered,
                        isHighLighted: value.isHighLighted,
                    }
                })
                console.log(parsedQuestions);
                setTitle(databaseRoom.title)
                setQuestions(parsedQuestions)

            })
        }

        getQuestions()
    }, [roomId])

    async function handleSendQuestion(e: FormEvent) {
        e.preventDefault()
        if (newQuestion.trim() === '') {
            toast.error('Campo de pergunta vazio!')
            return
        }

        if (!user) {
            throw new Error('You must be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswered: false
        }

        try {
            await database.ref(`rooms/${roomId}/questions`).push(question)
            setNewQuestion('')
        } catch (error) {
            console.log(error);

        }


    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={e => setNewQuestion(e.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login.</button></span>
                        )

                        }
                        <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
                    </div>
                </form>

                {/* {JSON.stringify(questions)} */}
            </main>
        </div>
    )
}