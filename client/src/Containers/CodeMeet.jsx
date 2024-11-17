import { CopyOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CodeMeet = () => {
  const { classCode } = useParams();
  const [copied, setCopied] = useState(null);

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

  return (
    <div className="code-meet-container">
      <div className="code-meet-header">
        <div className="code-meet-heading">Code Meet</div> &nbsp;&nbsp;
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
      <div className="">description</div>
    </div>
  );
};

export default CodeMeet;
