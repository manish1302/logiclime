import React, { useEffect, useState } from "react";
import { runCode } from "../Api";
import { getAssignmentById } from "../Endpoints/Assignment";
import { useParams } from "react-router-dom";
import { Card, Typography, Tag, Divider, Row, Col, List } from "antd";
import { saveStudentCode } from "../Endpoints/StudentMarks";
import MarksInput from "./MarksInput";
import { Button, message, Space } from "antd";
import { isStudent } from "../Helpers";

const { Title, Text } = Typography;

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "green";
    case "Medium":
      return "orange";
    case "Hard":
      return "red";
    default:
      return "blue";
  }
};

const Output = ({
  language,
  editorRef,
  assignment,
  studentId,
  markss,
  assignmentId,
  editorOption,
  isDiscussion
}) => {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [marks, setMarks] = useState("");
  const { assignmentCode } = useParams();
  const [isEditable, setIsEditable] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Submitted",
    });
  };

  useEffect(() => {
    if (markss) {
      setMarks(markss);
      setIsEditable(false);
    }
  }, [markss]);

  const handleRunCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    setError("");
    setOutput("...compiling");
    const { run } = await runCode(language, sourceCode);
    setError(run.stderr);
    setOutput(run.stdout);
  };

  const handleSubmit = () => {
    setMarks("");
    success()
    saveStudentCode({
      code: editorRef.current.getValue(),
      assignmentId: assignmentCode,
      language: language,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {contextHolder}
      <div className="d-flex align-items-center">
        <button className="run-code" onClick={handleRunCode}>
          Run Code
        </button>{" "}
        &nbsp; &nbsp;
        {isStudent() && (
          <button
            className="submit-code"
            style={{ marginRight: "16px" }}
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
        {isDiscussion && <MarksInput
          studentId={studentId}
          marks={marks}
          setMarks={setMarks}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          assignmentId={assignmentId}
        />}
        {/* <div
          className="link-text mx-3"
          style={{ textDecoration: "underline", color: "blue" }}
        >
          Remarks
        </div> */}
      </div>
      <Card
        title={
          <div className="d-flex align-items-center justify-content-between">
            <div style={{color : "white"}}>{assignment?.title}</div>
            <Tag color={getDifficultyColor(assignment?.difficulty)}>
              {assignment?.difficulty}
            </Tag>
          </div>
        }
        variant = "borderless"
        bordered={true}
        style={{
          height: "47vh",
          width: "100%",
          marginBottom: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflowY: "auto",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color : "white"
        }}
      >
        {/* Description */}
        <Text style={{color : "grey", fontWeight : "400"}}>Description:</Text>
        <Text style={{ display: "block", marginBottom: "16px", fontSize: "18px", color : "white" }}>
          {assignment?.description}
        </Text>

        {/* Test Cases */}
        <Text style={{color : "grey"}}>Test Cases:</Text>
        <List
          style={{ marginBottom: "16px", border: "1px solid rgba(255,255,255,0.1)", }}
          bordered
          dataSource={assignment?.testCases}
          renderItem={(testCase, index) => (
            <List.Item>
              <Row
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Col span={12}>
                  <Text style={{color : "grey"}} >Input:</Text> <Text style={{color : "white"}}>{testCase.input}</Text>
                </Col>
                <Col span={12}>
                  <Text style={{color : "grey"}} >Output:</Text> <Text style={{color : "white"}}>{testCase.output}</Text>
                </Col>
              </Row>
              
            </List.Item>
          )}
        />

        {/* Function Signature */}
        {/* {assignment?.functionSignature && (
          <>
            <Text strong>Function Signature:</Text>
            <Text style={{ display: "block", marginBottom: "16px" }}>
              {assignment?.functionSignature}
            </Text>
            <Divider />
          </>
        )} */}

        {/* Constraints */}
        <Text style={{color : "grey"}}>Constraints:</Text>
        <Text style={{ display: "block", marginBottom: "16px", color : "white" }}>
          {assignment?.constraints}
        </Text>

        {/* Tags */}
        <Text style={{color : "grey"}} >Tags:</Text>
        <div style={{ margin: "8px 0 16px 0" }}>
          {assignment?.tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </div>
      </Card>
      <div className={`output ${error && "error-output"}`} style={{color : "white"}}>
        {error != ""
          ? error
          : output != ""
          ? output
          : <span style={{color : "grey"}}>//Run code to show output here</span>}
      </div>
    </>
  );
};

export default Output;
