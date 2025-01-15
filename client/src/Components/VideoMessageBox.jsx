const VideoMessage = ({message}) => {
    if(message){
        return <div className="call-info"> {message}</div>
    } else{
        return <></>
    }
}

export default VideoMessage