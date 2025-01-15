import { useEffect, useRef, useState } from "react";
import "./VideoPage.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import VideoMessageBox from "./VideoMessageBox";
import ActionButtons from "./ActionButtons/ActionButtons";

const CallerVideo = ({
  remoteStream,
  localStream,
  peerConnection,
  callStatus,
  updateCallStatus,
  userName,
  socket,
}) => {
  const remoteFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
  const localFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
  const navigate = useNavigate();
  const [videoMessage, setVideoMessage] = useState(
    "Please enable video to start!"
  );
  const [offerCreated, setOfferCreated] = useState(false);

  //send back to home if no localStream
  useEffect(() => {
    if (!localStream) {
      navigate(`/`);
    } else {
      //set video tags
      remoteFeedEl.current.srcObject = remoteStream;
      localFeedEl.current.srcObject = localStream;
    }
  }, []);

  //set video tags
  // useEffect(()=>{
  //     remoteFeedEl.current.srcObject = remoteStream
  //     localFeedEl.current.srcObject = localStream
  // },[])

  //if we have tracks, disable the video message
  useEffect(() => {
    if (peerConnection) {
      peerConnection.ontrack = (e) => {
        if (e?.streams?.length) {
          setVideoMessage("");
        } else {
          setVideoMessage("Disconnected...");
        }
      };
    }
  }, [peerConnection]);

  //once the user has shared video, start WebRTC'ing :)
  useEffect(() => {
    const shareVideoAsync = async () => {
      const offer = await peerConnection.createOffer();
      peerConnection.setLocalDescription(offer);
      //we can now start collecing ice candidates!
      // we need to emit the offer to the server
      socket.emit("newOffer", offer);
      setOfferCreated(true); //so that our useEffect doesn't make an offer again
      setVideoMessage("Awaiting answer..."); //update our videoMessage box
      console.log(
        "created offer, setLocalDesc, emitted offer, updated videoMessage"
      );
    };
    if (!offerCreated && callStatus.videoEnabled) {
      //CREATE AN OFFER!!
      console.log("We have video and no offer... making offer");
      shareVideoAsync();
    }
  }, [callStatus.videoEnabled, offerCreated]);

  useEffect(() => {
    const addAnswerAsync = async () => {
      await peerConnection.setRemoteDescription(callStatus.answer);
      console.log("Answer added!!");
    };
    if (callStatus.answer) {
      addAnswerAsync();
    }
  }, [callStatus]);

  return (
    <div>
      <div className="videos">
        <video
          id="local-feed"
          ref={localFeedEl}
          autoPlay
          playsInline
          style={{ width: '200px', height: '150px' }}
        ></video>
        <VideoMessageBox message={videoMessage} />
        <video
          id="remote-feed"
          ref={remoteFeedEl}
          autoPlay
          playsInline
          style={{ width: '200px', height: '150px' }}
        ></video>
      </div>
      <ActionButtons
        localFeedEl={localFeedEl}
        remoteFeedEl={remoteFeedEl}
        callStatus={callStatus}
        localStream={localStream}
        updateCallStatus={updateCallStatus}
        peerConnection={peerConnection}
      />
    </div>
  );
};

export default CallerVideo;
