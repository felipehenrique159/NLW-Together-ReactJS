import logoImg from '../../assets/images/logo.svg'
import Button from '../../components/Button'
import RoomCode from '../../components/RoomCode'
import '../../styles/room.scss'
import { useHistory, useParams } from 'react-router-dom'
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'
import Question from '../../components/Question'
import { useRoom } from '../../hooks/useRoom'
import { database } from '../../services/firebase'
import { useAuth } from '../../hooks/useAuth'
import { FiLogOut } from 'react-icons/fi'
import { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import emptyQuestionImg from '../../assets/images/empty-questions.svg'



type RoomParams = {
    id: string
}

export default function AdminRoom() {
    const params = useParams<RoomParams>()
    const roomId = params.id
    const history = useHistory()
    const { questions, title } = useRoom(roomId)
    const { user, logout } = useAuth()

    async function logoutGoogle(e: FormEvent) {
        e.preventDefault()
        try {
            await logout()
        } catch (error) {
            console.log(error);

        }
    }

    async function handleEndRoom() {
        try {
            await database.ref(`rooms/${roomId}`).update({
                closedAt: new Date()
            })

            history.push('/')

        } catch (error) {
            console.log(error);
        }

    }


    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
            try {
                await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        try {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isAnswered: true
            })
        } catch (error) {
            console.log(error);
        }
    }

    async function handleHighLightQuestion(questionId: string) {
        try {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHighLighted: true
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <Link to="/">
                        <img src={logoImg} alt="Letmeask" />
                    </Link>

                    <div>
                        {user && <Button onClick={logoutGoogle}>
                            <span className="label-sair">
                                Sair
                            </span>
                            <FiLogOut size={15} /> </Button>}
                        <RoomCode code={roomId} />
                        {user && <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>}
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                {questions.length === 0 &&
                    <div className="empty-questions">
                        <img src={emptyQuestionImg} alt="" />
                        <label>Ainda não há perguntas por aqui!</label>
                    </div>
                }


                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighLighted={question.isHighLighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="respondida" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleHighLightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="destacar pergunta" />
                                        </button>
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>

            </main>
        </div>
    )
}