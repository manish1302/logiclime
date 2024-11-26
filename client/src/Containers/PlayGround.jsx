import { Editor } from "@monaco-editor/react";
import React from "react";
import LanguageMenu from "../Components/LanguageMenu";
import Output from "../Components/Output";

const PlayGround = () => {
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
        <Output editorRef={editorRef} language={LANGUAGES[language - 1]} />
      </div>
    </div>
  );
};

export default PlayGround;
