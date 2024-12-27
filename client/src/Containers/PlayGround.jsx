import { Editor } from "@monaco-editor/react";
import React, { useEffect, useRef, useState } from "react";
import LanguageMenu from "../Components/LanguageMenu";
import Output from "../Components/Output";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS, LANGUAGES } from "../constants";
import { useParams } from "react-router-dom";
import { getAssignmentById } from "../Endpoints/Assignment";
import { getAssignmentCode } from "../Endpoints/StudentMarks";

const PlayGround = () => {
  const [language, setLanguage] = useState(1); // this is the id of that language
  const [codeSnippet, setCodeSnippet] = useState(
    Object.entries(CODE_SNIPPETS)[0][1]
  );
  const [value, setValue] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const editorRef = useRef(null);
  const [assignment, setAssignment] = useState(null);

  const { assignmentCode } = useParams();

  const languagesVersions = Object.entries(LANGUAGE_VERSIONS);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };
  useEffect(() => {
    getAssignmentById(assignmentCode)
      .then((res) => {
        setAssignment(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getAssignmentCode(assignmentCode).then(res => {
      setSubmittedCode(res?.data?.data);
    })
  }, []);

  useEffect(() => {
    if(LANGUAGES[language - 1] == submittedCode?.language) {
      setValue(submittedCode?.Code)
    } else {
      setValue(codeSnippet)
    }
  }, [language, submittedCode, codeSnippet])

  const onSelectChange = (value) => {
    setLanguage(value);
    setCodeSnippet(Object.entries(CODE_SNIPPETS)[value - 1][1]);
  };

  return (
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
        <Output
          editorRef={editorRef}
          language={LANGUAGES[language - 1]}
          assignment={assignment}
        />
      </div>
    </div>
  );
};

export default PlayGround;
