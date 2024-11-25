import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, code, theme, setCode }) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value) => {
    setValue(value);
    setCode(value);
  };

  return (
    <div>
      <Editor
        height={"75vh"}
        width={"70%"}
        language={language || "javascript"}
        value={value}
        theme={theme}
        defaultValue="// Write your code here"
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditor;
