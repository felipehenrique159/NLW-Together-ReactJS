import logoImg from '../../assets/images/logo.svg'
import Button from '../../components/Button'
import RoomCode from '../../components/RoomCode'
import '../../styles/room.scss'
import { useHistory, useParams } from 'react-router-dom'
import deleteImg from '../../assets/images/delete.svg'
import Question from '../../components/Question'
import { useRoom } from '../../hooks/useRoom'
import { database } from '../../services/firebase'

type RoomParams = {
    id: string
}

export default function AdminRoom() {
    const params = useParams<RoomParams>()
    const roomId = params.id
    const history = useHistory()
    const { questions, title } = useRoom(roomId)

    async function handleEndRoom() {
            try {
               await database.ref(`rooms/${roomId}`).update({
                    closedAt : new Date()
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

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>


                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question key={question.id} content={question.content} author={question.author}>
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