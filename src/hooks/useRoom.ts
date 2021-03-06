import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string
    }
    content: string,
    isHighLighted: boolean
    isAnswered: boolean
    likeCount:number,
    likeId:string | undefined
}

type FirebaseQuestion = Record<string, {
    author: {
        name: string,
        avatar: string
    }
    content: string,
    isHighLighted: boolean
    isAnswered: boolean,
    likes: Record<string,{
        authorId:string
    }>
}>

export function useRoom(roomId:string) {
    const {user} = useAuth()
    const [title, setTitle] = useState('')
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const history = useHistory()

    useEffect(() => {
        async function getQuestions() {
            const roomRef = await database.ref(`rooms/${roomId}`)
            
            roomRef.on('value', room => {
               
                const databaseRoom = room.val()
                if(!databaseRoom){ //caso tente passar na url uma sala não existente, redireciona pra home
                    history.push('/')
                    return
                }
                const firebaseQuestions: FirebaseQuestion = databaseRoom.questions ?? {}

                const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                    return {
                        id: key,
                        content: value.content,
                        author: value.author,
                        isAnswered: value.isAnswered,
                        isHighLighted: value.isHighLighted,
                        likeCount: Object.values(value.likes ?? {}).length,
                        likeId:Object.entries(value.likes ?? {}).find(([key,value]) => value.authorId === user?.id)?.[0]
                    }
                })
                setTitle(databaseRoom.title)
                setQuestions(parsedQuestions)

            })

            return() =>{
                roomRef.off('value')
            }
        }

        getQuestions()
    }, [roomId,user?.id])

    return {questions,title}

}