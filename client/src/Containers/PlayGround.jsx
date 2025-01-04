import { Editor } from "@monaco-editor/react";
import React, { useEffect, useRef, useState } from "react";
import LanguageMenu from "../Components/LanguageMenu";
import Output from "../Components/Output";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS, LANGUAGES } from "../constants";
import { useParams } from "react-router-dom";
import { getAssignmentById } from "../Endpoints/Assignment";
import { getAssignmentCode } from "../Endpoints/StudentMarks";
import { Segmented } from "antd";
import { initializeSocket } from "../socket";
import { getUserById } from "../Endpoints/Auth";
import { toast, Toaster } from "react-hot-toast";
import { isEducator, isStudent } from "../Helpers";

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
  const [editorOption, setEditorOption] = useState("Home");

  const socketRef = useRef(null);

  const onMountHome = (editor) => {
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
      });
      function handleErrors(err) {
        console.log(err);
      }

      socketRef.current.on("home-code", (data) => {
        setHomeValue(data);
      });

      socketRef.current.on("submission-code", ({
        data,
        educatorStudentId,
        fromStudentId,
      }) => {
        if (isEducator() && fromStudentId == studentId) {
          setValue(data);
        } else if (
          isStudent() &&
          localStorage.getItem("userId") == educatorStudentId
        ) {
          setValue(data);
        }
      });

      socketRef.current.on("disconnected", ({ socketId, username }) => {
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
  }, []);

  useEffect(() => {
    if (homeValue != "// code here") {
      socketRef.current.emit("home-code-changed", {
        data: homeValue,
        roomId: assignmentCode,
      });
    }
  }, [homeValue]);

  useEffect(() => {
    if (socketRef.current) {
      console.log("hiiii")
      socketRef.current.emit("submission-code", {
        data: value,
        educatorStudentId: studentId ?? "",
        fromStudentId: localStorage.getItem("userId"),
        roomId : assignmentCode
      });
    }
  }, [value]);

  console.log(homeValue + "xx", value + "yy");

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
          <div className="mb-2">
            <Segmented
              options={["Home", "Practice"]}
              onChange={(value) => {
                setEditorOption(value);
              }}
            />
          </div>
        </div>
        <div onClick={cursorPosition}>
          {editorOption == "Home" && (
            <Editor
              height={"75vh"}
              theme="vs-dark"
              language={LANGUAGES[language - 1]}
              value={homeValue}
              onChange={(data) => {
                setHomeValue(data);
              }}
              options={{
                readOnly: isStudent(),
              }}
              onMount={onMountHome}
            />
          )}
          {editorOption == "Practice" && (
            <Editor
              height={"75vh"}
              theme="vs-dark"
              language={LANGUAGES[language - 1]}
              defaultValue={"//code here"}
              value={value}
              onChange={(data) => {
                setValue(data);
              }}
              onMount={onMount}
            />
          )}
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
    </div>
  );
};

export default PlayGround;
