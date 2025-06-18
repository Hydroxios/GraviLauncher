interface AvatarProps {
    uuid: string
    size: number
    className?:string
}

const Avatar = ({
    uuid,
    size,
    className
}:AvatarProps) => {
    return (
        <img src={`https://minotar.net/helm/${uuid}/${size}.png`} className={className}/>
    )
}

export default Avatar;