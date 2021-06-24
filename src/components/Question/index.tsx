import '../../styles/question.scss'
// import { AiOutlineCheckCircle } from 'react-icons/ai'
// import { FiTrash } from 'react-icons/fi'
// import { BiMessage } from 'react-icons/bi'

type QuestionProps = {
    content: string
        author: {
            avatar: string,
            name: string
        }
}

export default function Question({content,author}: QuestionProps) {
    return(
        <div className="question">
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt="Avatar" />
                    <span>{author.name}</span>
                </div>
                <div></div>
            </footer>
        </div>
    )
   
}