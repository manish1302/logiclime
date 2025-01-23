import { Editor } from "@monaco-editor/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import LanguageMenu from "../Components/LanguageMenu";
import Output from "../Components/Output";
import ReactPlayer from "react-player";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS, LANGUAGES } from "../constants";
import { v4 as uuidv4 } from "uuid";
import {
  AudioMutedOutlined,
  AudioOutlined,
  PhoneFilled,
  VideoCameraAddOutlined,
  VideoCameraFilled,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getAssignmentById } from "../Endpoints/Assignment";
import micon from "../assets/mic-on.png";
import micoff from "../assets/mic-off.png";
import videoff from "../assets/videocam-off.png";
import videoon from "../assets/videocam.png";
import { getAssignmentCode } from "../Endpoints/StudentMarks";
import { Segmented } from "antd";
import { initializeDisussionSocket, initializeSocket } from "../socket";
import { getUserById } from "../Endpoints/Auth";
import { toast, Toaster } from "react-hot-toast";
import { isEducator, isStudent } from "../Helpers";
import Peer from "peerjs";
import CallCard from "../Components/CallCard";

const IconButton = ({ icon, icon2, type, alt, stream }) => {
  const [isRed, setIsRed] = useState(false);

  const toggleBackground = async () => {
    const track = stream.getTracks().find((track) => track.kind == type);
    track.enabled = !track.enabled;
    setIsRed((prev) => !prev);
  };

  return (
    <div
      className={`icon-container ${isRed ? "red" : "blue"}`}
      onClick={toggleBackground}
    >
      <img src={isRed ? icon : icon2} alt={alt} />
    </div>
  );
};

const Discussion = () => {
  const [language, setLanguage] = useState(1); // this is the id of that language
  const [codeSnippet, setCodeSnippet] = useState(
    Object.entries(CODE_SNIPPETS)[0][1]
  );
  const [value, setValue] = useState("");
  const [homeValue, setHomeValue] = useState("// code here");
  const [submittedCode, setSubmittedCode] = useState("");
  const editorRef = useRef(null);
  const [assignment, setAssignment] = useState(null);
  const { assignmentCode, studentId, classCode } = useParams();
  const [editorOption, setEditorOption] = useState("Home");
  const [position, setPosition] = useState(null);
  const [clients, setClients] = useState([]);
  const [remoteUserName, setRemoteUserName] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [userName, setUserName] = useState("");

  // peer
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [connection, setConnection] = useState(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const socketRef = useRef(null);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const getCurrentCursorPosition = () => {
    return editorRef?.current?.getPosition();
  };

  useEffect(() => {
    getAssignmentById(assignmentCode)
      .then((res) => {
        setAssignment(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });

    getAssignmentCode({
      assignmentCode: assignmentCode,
      studentId: studentId,
    }).then((res) => {
      setSubmittedCode(res?.data?.data);
    });
  }, []);

  useEffect(() => {
    if (LANGUAGES[language - 1] == submittedCode?.language) {
      setValue(submittedCode?.Code);
    } else {
      setValue(codeSnippet);
    }
  }, [language, submittedCode, codeSnippet]);

  const onSelectChange = (value) => {
    setLanguage(value);
    setCodeSnippet(Object.entries(CODE_SNIPPETS)[value - 1][1]);
  };

  const cursorPosition = () => {
    getCurrentCursorPosition();
  };
  // Peer logic

  // useEffect(() => {
  //   const peerId = uuidv4();
  //   setPeerId(peerId);
  // }, [])

  useEffect(() => {
    const initPeer = async () => {
      const newPeer = new Peer();
      
      newPeer.on('open', (id) => {
        setPeerId(id);
      });

      newPeer.on('call', (call) => {
        if (stream) {
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        }
      });

      newPeer.on('connection', (conn) => {
        setConnection(conn);
        setupDataConnection(conn);
      });

      setPeer(newPeer);
    };

    const initStream = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(userStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error('Failed to get media devices:', err);
      }
    };

    initPeer();
    initStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (peer) {
        peer.destroy();
      }
    };
  }, []);
  const setupDataConnection = (conn) => {
    conn.on('data', (data) => {
      if (data.type === 'videoState') {
        // Update remote video track visibility based on received state
        const remoteVideo = remoteVideoRef.current;
        if (remoteVideo && remoteVideo.srcObject) {
          const videoTracks = remoteVideo.srcObject.getVideoTracks();
          videoTracks.forEach(track => {
            track.enabled = data.isVideoOn;
          });
        }
      }
    });
  };

  const handleCall = () => {
    if (peer && stream && remotePeerId) {
      // Establish data connection first
      const conn = peer.connect(remotePeerId);
      setConnection(conn);
      setupDataConnection(conn);

      // Then establish media connection
      const call = peer.call(remotePeerId, stream);
      call.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      const newVideoState = !videoTrack.enabled;
      videoTrack.enabled = newVideoState;
      setIsVideoOn(newVideoState);

      // Send video state to peer
      if (connection && connection.open) {
        connection.send({
          type: 'videoState',
          isVideoOn: newVideoState
        });
      }
    }
  };

  // useEffect(() => {
  //   if (remotePeerIdValue) {
  //     call(remotePeerIdValue);
  //   }
  // }, [remotePeerIdValue])

  // Socket Logic here...
  useEffect(() => {
    const initialize = async () => {
      socketRef.current = await initializeDisussionSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
      socketRef.current.on("joined", ({ allClients, username, socketId }) => {
        toast.success(`${username} joined the room`);
        console.log(allClients, "allClients");
        setClients(allClients);
        const name = allClients.find(
          (item) => item.socketId === socketId
        )?.username;
        setRemoteUserName(name);
      });
      function handleErrors(err) {
        console.log(err);
      }

      socketRef.current.on("peerId", (peerId) => {
        console.log(peerId);
        setRemotePeerIdValue(peerId);
      });

      socketRef.current.on("code-changed", ({ data, position }) => {
        setValue(data);
        setPosition(position);
      });

      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.error(`${username} left the room`);
      });

      getUserById()
        .then((res) => {
          const sId = isEducator() ? studentId : localStorage.getItem("userId");
          setUserName(res?.data?.name);
          socketRef.current.emit("join-room", {
            roomId: assignmentCode + sId,
            username: res?.data?.name,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    initialize();

    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
      }
    };
  }, []);

  function toggleState(element) {
    element.classList.toggle("red");
  }

  const toggleBackground = async (stream) => {
    const track = stream.getTracks().find((track) => track.kind == type);
    track.enabled = !track.enabled;
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Video Chat</h2>
        <p className="mb-2">Your ID: {peerId}</p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
            placeholder="Enter peer ID to call"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleCall}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Call
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full rounded bg-gray-200"
          />
          <button
            onClick={toggleVideo}
            className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow"
          >
            {isVideoOn ? <button>off</button> : <button>on</button>}
          </button>
        </div>
        <div>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full rounded bg-gray-200"
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default Discussion;
