import { Editor } from "@monaco-editor/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import LanguageMenu from "../Components/LanguageMenu";
import Output from "../Components/Output";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS, LANGUAGES } from "../constants";
import { useParams } from "react-router-dom";
import { getAssignmentById } from "../Endpoints/Assignment";
import { getAssignmentCode } from "../Endpoints/StudentMarks";
import { ConfigProvider, Segmented, theme, Space } from "antd";
import { initializeSocket } from "../socket";
import { getUserById } from "../Endpoints/Auth";
import { toast, Toaster } from "react-hot-toast";
import { isEducator, isStudent } from "../Helpers";
import VideoSDK from "../Components/VideoSDK";
import { debounce } from "lodash";

const PlayGround = () => {
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
  const [editorOption, setEditorOption] = useState("Session");
  const [allJoinedUsers, setAllJoinedUsers] = useState([]);
  const [allOtherClients, setAllOtherClient] = useState([]);
  const { darkAlgorithm } = theme;

  const socketRef = useRef(null);

  const onMountHome = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    monaco.editor.defineTheme("myCustomTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0d1117",
      },
    });

    monaco.editor.setTheme("myCustomTheme");
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    const position = { lineNumber: 2, column: 5 };

    // editor.deltaDecorations(
    //   [],
    //   [
    //     {
    //       range: new monaco.Range(
    //         position.lineNumber,
    //         position.column,
    //         position.lineNumber,
    //         position.column
    //       ),
    //       options: {
    //         className: "secondary-cursor",
    //         afterContentClassName: "username-label", // Add styling for the label
    //       },
    //     },
    //   ]
    // );
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

  // Socket Logic here...
  useEffect(() => {
    const initialize = async () => {
      socketRef.current = await initializeSocket(classCode);
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
      socketRef.current.on("joined", ({ allClients, username, socketId }) => {
        toast.success(`${username} joined the room`);
        setAllJoinedUsers(allClients);
        setAllOtherClient(
          allClients.filter((client) => client.socketId != socketId)
        );
      });
      function handleErrors(err) {
        console.log(err);
      }

      socketRef.current.on("home-code", ({ data, socketId }) => {
        if (!isEducator()) setHomeValue(data);
      });

      socketRef.current.on("disconnected", ({ socketId, username }) => {
        setAllJoinedUsers((prev) =>
          prev.filter((user) => user.socketId !== socketId)
        );
        toast.error(`${username} left the room`);
      });

      getUserById()
        .then((res) => {
          socketRef.current.emit("join-room", {
            roomId: assignmentCode,
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

  // useEffect(() => {
  //   if (homeValue != "// code here") {
  //     socketRef.current.emit("home-code-changed", {
  //       data: homeValue,
  //       roomId: assignmentCode,
  //     });
  //   }
  // }, [homeValue]);

  // const sendCodeUpdate = useCallback(
  //   debounce((data) => {
  //     if (socketRef.current && data != "// code here") {
  //       socketRef.current.emit("home-code-changed", {
  //         data,
  //         roomId: assignmentCode,
  //         clients : allOtherClients
  //       });
  //     }
  //   }, 300),
  //   []
  // );

  const handleEditorChange = (data) => {
    if (socketRef.current && data != "// code here") {
      socketRef.current.emit("home-code-changed", {
        data,
        roomId: assignmentCode,
      });
    }
    setHomeValue(data);
  };

  return (
    <div className="code-and-compile">
      <div>
        <Toaster />
      </div>
      <div className="code-editor-box">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <LanguageMenu onSelectChange={onSelectChange} language={language} />
          </div>
          <div>
            <ConfigProvider
              theme={{
                components: {
                  Segmented: {
                    itemSelectedBg: "#1677ff", // selected background
                    itemHoverBg: "#40a9ff", // hover background
                    itemSelectedColor: "#ffffff", // <-- selected text color
                    itemColor: "rgba(255,255,255,0.85)", // normal text color
                  },
                },
              }}
            >
              <Segmented
                options={["Session", "Practice"]}
                onChange={(value) => setEditorOption(value)}
                style={{
                  backgroundColor: "#1f1f1f",
                  color: "#fff",
                  borderColor: "#333",
                }}
              />
            </ConfigProvider>
          </div>
        </div>
        <div onClick={cursorPosition}>
          {editorOption == "Session" && (
            <div
              style={{
                height: "75vh",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Editor
                height={"75vh"}
                theme="vs-dark"
                language={LANGUAGES[language - 1]}
                value={homeValue}
                onChange={(data) => {
                  handleEditorChange(data);
                }}
                options={{
                  readOnly: isStudent(),
                  scrollbar: {
                    verticalScrollbarSize: 6, // 👈 reduce vertical scrollbar width
                    horizontalScrollbarSize: 6, // 👈 reduce horizontal scrollbar height
                    alwaysConsumeMouseWheel: false, // optional: allows page scroll with wheel
                  },
                }}
                onMount={onMountHome}
              />
            </div>
          )}
          {editorOption == "Practice" && (
            <div
              style={{
                height: "75vh",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Editor
                height={"75vh"}
                theme="vs-dark"
                language={LANGUAGES[language - 1]}
                defaultValue={"//code here"}
                options={{
                  scrollbar: {
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                    alwaysConsumeMouseWheel: false, // optional: allows page scroll with wheel
                  },
                }}
                value={value}
                onChange={(data) => {
                  setValue(data);
                }}
                onMount={onMount}
              />
            </div>
          )}
        </div>
      </div>
      <div className="output-box mx-3">
        <Output
          editorRef={editorRef}
          language={LANGUAGES[language - 1]}
          assignment={assignment}
          studentId={studentId}
          markss={submittedCode?.Marks}
          assignmentId={assignmentCode}
          editorOption={editorOption}
          isDiscussion={false}
        />
      </div>
      <div className="call-details">
        {/* <div className="d-flex align-items-center">
            <div className="cursor-pointer my-3">
              <PhoneFilled style={{ color: "#00CC00" }} /> Call
            </div>
            &nbsp; &nbsp;
            <div className="cursor-pointer my-3">
              <PhoneFilled style={{ color: "#00CC00" }} /> accept
            </div>
          </div> */}
        <h3 className="my-3 text-white">Call Details</h3>
        <div className="video">
          <VideoSDK userName={"userName"} remoteUserNames={allJoinedUsers} />
        </div>
      </div>
    </div>
  );
};

export default PlayGround;
