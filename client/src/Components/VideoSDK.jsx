import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { authToken, createMeeting } from "../service/VideoAPI";
import micon from "../assets/mic-on.png";
import micoff from "../assets/mic-off.png";
import videoff from "../assets/videocam-off.png";
import videoon from "../assets/videocam.png";
import endcall from "../assets/end-call.png";
import { PhoneFilled } from "@ant-design/icons";

const IconButton = ({ icon, isOn }) => {
  return (
    <div className={`icon-container ${!isOn ? "red" : "blue"}`}>
      <img src={icon} />
    </div>
  );
};

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState(null);
  const onClick = async () => {
    await getMeetingAndToken(meetingId);
  };
  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div className="d-flex flex-column align-items-center justify-content-center">
        <input
          type="text"
          placeholder="Enter Meeting Id"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
          className="meeting-input"
          onChange={(e) => {
            setMeetingId(e.target.value);
          }}
        />
        <button
          style={{ backgroundColor: "white", border: "none" }}
          onClick={onClick}
        >
          <div className="cursor-pointer">
            <PhoneFilled style={{ color: "#00CC00" }} /> Join call
          </div>
        </button>
      </div>
      <br />
      <div className="d-flex align-items-center justify-content-between w-100">
        <div style={{ borderTop: "1px solid lightgrey", width: "43%" }}></div>
        {" or "}
        <div style={{ borderTop: "1px solid lightgrey", width: "43%" }}></div>
      </div>
      <br />
      <button
        style={{ backgroundColor: "white", border: "none" }}
        onClick={onClick}
      >
        <div className="cursor-pointer">
          <PhoneFilled style={{ color: "#00CC00" }} /> Create meeting
        </div>
      </button>
    </div>
  );
}

function ParticipantView(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="my-3">
      <div className="d-flex flex-column align-items-center videobox">
        <div className="part-name">Participant: {props.username}</div>
        <audio ref={micRef} autoPlay playsInline muted={isLocal} />
        {webcamOn ? (
          <ReactPlayer
            playsinline 
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={videoStream}
            width={"100%"}
            height={"220px"}
            onError={(err) => {
              console.log(err, "participant video error");
            }}
          />
        ) : (
          <div className="webcam-off-card">
            <div className="initial">{props?.username?.slice(0,2)}</div>
          </div>
        )}
        <Controls webCamOn={webcamOn} micOn={micOn} isRemote = {props.isRemote}/>
      </div>
    </div>
  );
}

function Controls({ webCamOn, micOn, isRemote}) {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div className="my-3">
      <button className="toggle-buttons" onClick={() => {!isRemote && toggleMic()}}>
        {micOn ? (
          <IconButton icon={micon} isOn={true} />
        ) : (
          <IconButton icon={micoff} isOn={false} />
        )}
      </button>
      <button className="toggle-buttons" onClick={() =>  {!isRemote && toggleWebcam()}}>
        {webCamOn ? (
          <IconButton icon={videoon} isOn={true} />
        ) : (
          <IconButton icon={videoff} isOn={false} />
        )}
      </button>
      <button className="toggle-buttons" onClick={() =>  {!isRemote && leave()}}>
        <div className={`icon-container maroon`}>
          <img src={endcall} />
        </div>
      </button>
    </div>
  );
}
function MeetingView(props) {
  const [joined, setJoined] = useState(null);
  //Get the method which will be used to join the meeting.
  //We will also get the participants list to display all participants
  const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  console.log(props.remoteUserNames, "remoteUserNames");

  return (
    <div className="videosdk-container">
      <h5>Meeting Id: {props.meetingId}</h5>
      {joined && joined == "JOINED" ? (
        <div>
          {[...participants.keys()].map((participantId, index) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
              username={!index ? props.userName : (props.remoteUserNames?.length > 0 && props.remoteUserNames[index]?.username)}
              isRemote={index}
            />
          ))}
        </div>
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button
          style={{ backgroundColor: "white", border: "none" }}
          onClick={joinMeeting}
        >
          <div className="cursor-pointer">
            <PhoneFilled style={{ color: "#00CC00" }} /> Join call
          </div>
        </button>
      )}
    </div>
  );
}
const VideoSDK = ({ userName, remoteUserNames }) => {
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Manish",
      }}
      token={authToken}
    >
      <MeetingView
        meetingId={meetingId}
        onMeetingLeave={onMeetingLeave}
        userName={userName}
        remoteUserNames={remoteUserNames}
      />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
};

export default VideoSDK;
