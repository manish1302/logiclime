import { CopyOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClassroomByCode } from "../Endpoints/Classroom";
import LanguageMenu from "../Components/LanguageMenu";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS, LANGUAGES } from "../constants";
import { Button } from "antd";
import { Editor } from "@monaco-editor/react";
import Output from "../Components/Output";

const CodeMeet = () => {
  const { classCode } = useParams();
  const [copied, setCopied] = useState(null);
  const [classroomData, setClassroomData] = useState({});
  const [language, setLanguage] = useState(1); // this is the id of that language
  const [codeSnippet, setCodeSnippet] = useState(
    Object.entries(CODE_SNIPPETS)[0][1]
  );
  const [value, setValue] = useState("");
  const editorRef = useRef(null);

  const languagesVersions = Object.entries(LANGUAGE_VERSIONS);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  useEffect(() => {
    setValue(codeSnippet);
  }, [codeSnippet]);

  useEffect(() => {
    getClassroomByCode(classCode).then((res) => {
      setClassroomData(res.data.classroom);
    });
  }, []);

  const handleCopy = () => {
    if (classCode) {
      navigator.clipboard
        .writeText(classCode)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error("Error copying text: ", err));
    }
  };

  const onSelectChange = (value) => {
    setLanguage(value);
    setCodeSnippet(Object.entries(CODE_SNIPPETS)[value - 1][1]);
  };

  const runCode = () => {};

  return (
    <div className="code-meet-container">
      <div className="code-meet-header">
        <div className="d-flex align-items-center">
          <div className="code-meet-heading">{classroomData.name}</div>
          <div className="d-flex align-items-center code-copy">
            <pre
              style={{
                padding: "2px 10px",
                backgroundColor: "#f4f4f4",
                borderRadius: "5px",
                width: "fit-content",
                marginRight: "8px",
              }}
            >
              <code>{classCode}</code>
            </pre>{" "}
            {copied ? (
              <div style={{ color: "grey" }}>Copied!</div>
            ) : (
              <CopyOutlined
                className="cursor-pointer"
                style={{ color: "grey" }}
                onClick={handleCopy}
              />
            )}
          </div>
        </div>
        <div className="d-flex align-items-center">
          <h4>Educator</h4> : Manish patil
        </div>
      </div>
      <div className="">{classroomData.description}</div>
      <div className="code-and-compile">
        <div className="code-editor-box">
          <div>
            <LanguageMenu onSelectChange={onSelectChange} language={language} />
          </div>
          <div>
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
          </div>
        </div>
        <div className="output-box">
          <Output editorRef = {editorRef} language = {LANGUAGES[language - 1]} />
        </div>
      </div>
    </div>
  );
};

export default CodeMeet;
