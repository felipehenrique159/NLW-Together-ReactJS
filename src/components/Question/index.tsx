import { ReactNode } from 'react'
import '../../styles/question.scss'
import cn from 'classnames'


type QuestionProps = {
    content: string
    author: {
        avatar: string,
        name: string
    }
    children?: ReactNode
    isAnswered?: boolean
    isHighLighted?: boolean
}

export default function Question({ content, author, children, isAnswered = false, isHighLighted = false }: QuestionProps) {
    return (
        <div className={cn('question', {answered : isAnswered} ,{highLighted : isHighLighted && !isAnswered})}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt="Avatar" />
                    <span>{author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </div>
    )

}