import { Editor } from "@monaco-editor/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import LanguageMenu from "../Components/LanguageMenu";
import Output from "../Components/Output";
import ReactPlayer from "react-player";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS, LANGUAGES } from "../constants";
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
import CallCard from "../Components/CallCard";
import peer from "../service/peer";

const IconButton = ({ icon, icon2, type, alt, stream, setStream }) => {
  const [isRed, setIsRed] = useState(false);

  const toggleBackground = async () => {
    const track = stream.getTracks().find(track => track.kind == type);
    track.enabled = !track.enabled
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
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const socketRef = useRef(null);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();

    // if (position) {
    //   decorationRef.current = editor.deltaDecorations(
    //     [], // Clear existing decorations
    //     [
    //       {
    //         range: new monaco.Range(
    //           position.lineNumber,
    //           position.column,
    //           position.lineNumber,
    //           position.column
    //         ),
    //         options: {
    //           className: "secondary-cursor",
    //           afterContentClassName: "username-label", // Add styling for the label (can customize as per requirement)
    //         },
    //       },
    //     ]
    //   );
    // }
  };

  // useEffect(() => {
  //   if (editorRef.current && position) {
  //     // Remove the previous decoration
  //     if (decorationRef.current) {
  //       editorRef.current.deltaDecorations(decorationRef.current, []);
  //     }

  //     // Add the new cursor decoration
  //     decorationRef.current = editorRef.current.deltaDecorations(
  //       [], // Clear previous decorations
  //       [
  //         {
  //           range: new monaco.Range(
  //             position.lineNumber,
  //             position.column,
  //             position.lineNumber,
  //             position.column
  //           ),
  //           options: {
  //             className: "secondary-cursor",
  //             afterContentClassName: "username-label", // Optional styling
  //           },
  //         },
  //       ]
  //     );
  //   }
  // }, [position])

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

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socketRef.current.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socketRef.current]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      console.log("142");
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socketRef.current.emit("call:accepted", { to: from, ans });
    },
    [socketRef.current]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socketRef.current.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socketRef.current]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socketRef.current.emit("peer:nego:done", { to: from, ans });
    },
    [socketRef.current]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  // Socket Logic here...
  useEffect(() => {
    const initialize = async () => {
      socketRef.current = await initializeDisussionSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
      socketRef.current.on("joined", ({ allClients, username, socketId }) => {
        toast.success(`${username} joined the room`);
        setClients(allClients);
        setRemoteSocketId(socketId);
      });
      function handleErrors(err) {
        console.log(err);
      }

      socketRef.current.on("incomming:call", handleIncommingCall);
      socketRef.current.on("call:accepted", handleCallAccepted);
      socketRef.current.on("peer:nego:needed", handleNegoNeedIncomming);
      socketRef.current.on("peer:nego:final", handleNegoNeedFinal);

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
          console.log(sId);
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

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="code-and-compile">
        <div className="code-editor-box">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <LanguageMenu
                onSelectChange={onSelectChange}
                language={language}
              />
            </div>
          </div>
          <div onClick={cursorPosition}>
            <Editor
              height={"75vh"}
              theme="vs-dark"
              language={LANGUAGES[language - 1]}
              defaultValue={"//code here"}
              value={value}
              onChange={(data) => {
                if (socketRef.current) {
                  const sId = isEducator()
                    ? studentId
                    : localStorage.getItem("userId");
                  socketRef.current.emit("code-changed", {
                    data: data,
                    position: getCurrentCursorPosition(),
                    roomId: assignmentCode + sId,
                  });
                }
                setValue(data);
              }}
              onMount={onMount}
            />
          </div>
        </div>
        <div className="output-box">
          <Output
            editorRef={editorRef}
            language={LANGUAGES[language - 1]}
            assignment={assignment}
            studentId={studentId}
            markss={submittedCode?.Marks}
            assignmentId={assignmentCode}
            editorOption={editorOption}
          />
        </div>
        <div className="call-details">
          <div className="d-flex align-items-center">
            {remoteSocketId && (
              <div className="cursor-pointer my-3" onClick={handleCallUser}>
                <PhoneFilled style={{ color: "#00CC00" }} /> Call
              </div>
            )}
            &nbsp; &nbsp;
            {myStream && (
              <div className="cursor-pointer my-3" onClick={sendStreams}>
                <PhoneFilled style={{ color: "#00CC00" }} /> accept
              </div>
            )}
          </div>
          {/* {clients.map((item) => {
            return <CallCard username={item.username} />;
          })} */}
          {console.log(myStream, remoteStream, "mmmm")}
          {myStream && (
            <div className="d-flex flex-column align-items-center">
              <div className="caller-details bg-dark">
                <div className="caller-name">Manish</div>
                <ReactPlayer
                  playing
                  muted
                  width="200px"
                  height="150px"
                  url={myStream}
                />
              </div>
              <div className="d-flex py-2">
                <IconButton
                  type="video"
                  icon2={videoon}
                  icon={videoff}
                  alt="Video Icon"
                  stream={myStream}
                  setStream={setMyStream}
                />{" "}
                &nbsp; &nbsp;
                <IconButton
                  type="audio"
                  icon2={micon}
                  icon={micoff}
                  alt="Audio Icon"
                  stream = {myStream}
                  setStream={setMyStream}
                />
              </div>
            </div>
          )}
          {remoteStream && (
            <div className="d-flex flex-column align-items-center">
              <div className="caller-details bg-dark">
                <div className="caller-name">Manish</div>
                <ReactPlayer
                  playing
                  muted
                  width="200px"
                  height="150px"
                  url={remoteStream}
                />
              </div>
              <div className="d-flex py-2">
                <IconButton
                  type="video"
                  icon2={videoon}
                  icon={videoff}
                  alt="Video Icon"
                  stream = {remoteStream}
                  setStream={setRemoteStream}
                />{" "}
                &nbsp; &nbsp;
                <IconButton
                  type="audio"
                  icon2={micon}
                  icon={micoff}
                  alt="Audio Icon"
                  stream={remoteStream}
                  setStream={setRemoteStream}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Discussion;
