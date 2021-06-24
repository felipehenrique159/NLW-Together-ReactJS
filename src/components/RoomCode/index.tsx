import toast from 'react-hot-toast'
import copyImg from '../../assets/images/copy.svg'
import '../../styles/room-code.scss'

type RoomCodeProps ={
    code:string
}

export default function RoomCode(props:RoomCodeProps) {

    function copyRoomCodeToClipBoard() {
        navigator.clipboard.writeText(props.code)
        toast.success('Código da sala copiado!')
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToClipBoard}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala {props.code}</span>
        </button>
    )
}