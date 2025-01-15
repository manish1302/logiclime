import { peerConfigurations } from "./constants";

export const isTokenExpired = (token) => {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const expiry = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() > expiry;
}


export const isStudent = () => {
    return localStorage.getItem('role') == 'Student'
}

export const isEducator = () => {
    return localStorage.getItem('role') == 'Educator'
}

export const prepForCall = (callStatus, setCallStatus, setLocalStream) => {
    return new Promise(async(resolve, reject) => {
        const constraints = {
            video : true,
            audio : false
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const copyCallStatus = {...callStatus}
            copyCallStatus.haveMedia = true
            copyCallStatus.videoEnabled = null
            copyCallStatus.audioEnabled =  false
            setCallStatus(copyCallStatus)
            setLocalStream(stream)
            resolve()
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

export const createPeerConnection = (username, typeOfCall, socketRef) => {
    const peerConnection = new RTCPeerConnection(peerConfigurations);
    const remoteStream = new MediaStream();

    peerConnection.addEventListener('signalingstatechange', (e => {
        console.log(e)
    }))

    peerConnection.addEventListener('icecandidate', e => {
        if(e.candidate) {
            socketRef.current.emit('sendIceCandidateToSignalingServer',{
                iceCandidate : e.candidate,
                username : username,
                didIOffer : typeOfCall == "offer"
            })
        }
    })
    peerConnection.addEventListener('icecandidate', e => {
        //remote has sent us a track
        e.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track, remoteStream)
        });
    })
    return {
        peerConnection,
        remoteStream
    }
}

export const clientSocketListeners = (socket,typeOfCall,callStatus,
    setCallStatus,peerConnection)=>{
    socket.on('answerResponse',entireOfferObj=>{
        console.log(entireOfferObj);
        const copyCallStatus = {...callStatus}
        copyCallStatus.answer = entireOfferObj.answer
        copyCallStatus.myRole = typeOfCall
        setCallStatus(copyCallStatus)
    })

    socket.on('receivedIceCandidateFromServer',iceC=>{
        if(iceC){
            peerConnection.addIceCandidate(iceC).catch(err=>{
                console.log("Chrome thinks there is an error. There isn't...")
            })
            console.log(iceC)
            console.log("Added an iceCandidate to existing page presence")
            // setShowCallInfo(false);
        }
    })
}