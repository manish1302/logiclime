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
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button onClick={onClick}>Join</button>
      {" or "}
      <button onClick={onClick}>Create Meeting</button>
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
    <div>
      <p>
        Participant: {props.username}
      </p>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          //
          playsinline // extremely crucial prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          width={"100%"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
      <Controls webCamOn={webcamOn} micOn={micOn} />
    </div>
  );
}

function Controls({ webCamOn, micOn }) {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div>
      <button className="toggle-buttons" onClick={() => toggleMic()}>
        {micOn ? (
          <IconButton icon={micon} isOn={true} />
        ) : (
          <IconButton icon={micoff} isOn={false} />
        )}
      </button>
      <button className="toggle-buttons" onClick={() => toggleWebcam()}>
        {webCamOn ? (
          <IconButton icon={videoon} isOn={true} />
        ) : (
          <IconButton icon={videoff} isOn={false} />
        )}
      </button>
      <button className="toggle-buttons" onClick={() => leave()}>
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

  return (
    <div className="videosdk-container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined == "JOINED" ? (
        <div>
          {[...participants.keys()].map((participantId, index) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
              username = {!index ? props.userName : props.remoteUserName}
            />
          ))}
        </div>
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}
const VideoSDK = ({userName, remoteUserName}) => {
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
      <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} userName = {userName} remoteUserName = {remoteUserName} />
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
};

export default VideoSDK;
