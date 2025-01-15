import { useState, useEffect, useRef } from 'react';
import HangupButton from './HangupButton'
import VideoButton from './VideoButton';
import AudioButton from './AudioButton';

const ActionButtons = ({callStatus,localFeedEl, remoteFeedEl,updateCallStatus,localStream,peerConnection, socket})=>{
    // const callStatus = useSelector(state=>state.callStatus);
    const menuButtons = useRef(null)

    return(
        <div ref={menuButtons} className="row">
            <div >
                <AudioButton 
                    localFeedEl={localFeedEl}
                    callStatus={callStatus}
                    updateCallStatus={updateCallStatus}
                    localStream={localStream}
                    peerConnection={peerConnection}                    
                />
                <VideoButton 
                    localFeedEl={localFeedEl}
                    callStatus={callStatus}
                    localStream={localStream}
                    updateCallStatus={updateCallStatus}
                    peerConnection={peerConnection}
                />
            </div>
            <div >
                <HangupButton
                    localFeedEl={localFeedEl}
                    remoteFeedEl={remoteFeedEl}
                    peerConnection={peerConnection}
                    callStatus={callStatus}
                    updateCallStatus={updateCallStatus}
                />
            </div>        
        </div>
    )
}

export default ActionButtons;