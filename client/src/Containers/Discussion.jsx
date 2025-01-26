import { Editor } from "@monaco-editor/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import LanguageMenu from "../Components/LanguageMenu";
import Output from "../Components/Output";
import ReactPlayer from "react-player";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS, LANGUAGES } from "../constants";
import { PhoneFilled } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getAssignmentById } from "../Endpoints/Assignment";
import micon from "../assets/mic-on.png";
import micoff from "../assets/mic-off.png";
import videoff from "../assets/videocam-off.png";
import videoon from "../assets/videocam.png";
import { getAssignmentCode } from "../Endpoints/StudentMarks";
import { initializeDisussionSocket, initializeSocket } from "../socket";
import { getUserById } from "../Endpoints/Auth";
import { toast, Toaster } from "react-hot-toast";
import { isEducator, isStudent } from "../Helpers";
import VideoSDK from "../Components/VideoSDK";

const IconButton = ({ icon, icon2, type, alt, stream, setStream }) => {
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
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [userName, setUserName] = useState("");
  const [remoteName, setRemoteName] = useState("");

  const socketRef = useRef(null);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const getCurrentCursorPosition = () => {
    return editorRef?.current?.getPosition();
  };

  // video SDk logic here...
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
        setRemoteName(username);
      });
      function handleErrors(err) {
        console.log(err);
      }

      // socketRef.current.on("incomming:call", handleIncommingCall);
      // socketRef.current.on("call:accepted", handleCallAccepted);
      // socketRef.current.on("peer:nego:needed", handleNegoNeedIncomming);
      // socketRef.current.on("peer:nego:final", handleNegoNeedFinal);

      socketRef.current.on("code-changed", ({ data, position }) => {
        setValue(data);
        setPosition(position);
      });

      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.error(`${username} left the room`);
      });

      getUserById()
        .then((res) => {
          setUserName(res?.data?.name);
          const sId = isEducator() ? studentId : localStorage.getItem("userId");
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
            <div className="cursor-pointer my-3">
              <PhoneFilled style={{ color: "#00CC00" }} /> Call
            </div>
            &nbsp; &nbsp;
            <div className="cursor-pointer my-3">
              <PhoneFilled style={{ color: "#00CC00" }} /> accept
            </div>
          </div>
          <VideoSDK userName = {userName} remoteUserName = {remoteName} />
        </div>
      </div>
    </>
  );
};

export default Discussion;
