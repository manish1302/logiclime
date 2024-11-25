import React, { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import { loader } from "@monaco-editor/react";
import axios from "axios";
import { languageOptions } from "../Constants/languageoptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../Lib/defineTheme";
import useKeyPress from "../Hooks/useKeyPress";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropDown from "./ThemeDropDown";
import LanguageDropdown from "./LanguageDropdown";

const javascriptDefault = "// Javascript editor";

const CodeAndCompile = () => {
  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [language, setLanguage] = useState(languageOptions[0]);
  const [theme, setTheme] = useState(false);

  useEffect(() => {
    loader
      .init()
      .then((monaco) => {
        import("monaco-themes/themes/All Hallows Eve.json").then((data) => {
          console.log(data, "data")
          monaco.editor.defineTheme("Blackboard", data);
          setTheme(true);
        });
      })
      .catch((error) =>
        console.error(
          "An error occurred during initialization of Monaco: ",
          error
        )
      );
  }, []);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  useEffect(() => {
    handleCompile();
  }, [ctrlPress, enterPress]);

  const handleCompile = () => {
    // later
  };

  const checkStatus = () => {};

  // function handleThemeChange(th) {
  //   const theme = th;

  //   if (["light", "dark"].includes(theme.value)) {
  //     setTheme(theme);
  //   }
  // }
  const showSuccessToast = (msg) => {
    toast.success(msg || "Compiled Successfully", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
      <div className="dropdown-container">
        <div className="language-dropdown">
          <LanguageDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropDown
            className="theme-dropdown"
            handleThemeChange={(value) => {
              handleThemeChange(value);
            }}
            theme={theme}
          />
        </div>
      </div>
      {console.log(language, "language")}
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language?.value}
            theme={theme}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <button
              onClick={handleCompile}
              disabled={!code}
              className={"compile-button"}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
    </>
  );
};

export default CodeAndCompile;
