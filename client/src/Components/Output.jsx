import React, { useState } from "react";
import { runCode } from "../Api";

const Output = ({ language, editorRef }) => {
  const [output, setOutput] = useState(null);
  const handleRunCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    setOutput("...compiling")
    const { run } = await runCode(language, sourceCode);
    setOutput(run.stdout);
  };
  return (
    <>
      <button className="run-code" onClick={handleRunCode}>
        Run Code
      </button>
      <div className="output">
        {output ? output : "//Run code to show output here"}
      </div>
    </>
  );
};

export default Output;
