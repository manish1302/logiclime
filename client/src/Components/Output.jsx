import React, { useEffect, useState } from "react";
import { runCode } from "../Api";
import { getAssignmentById } from "../Endpoints/Assignment";
import { useParams } from "react-router-dom";
import { Card, Typography, Tag, Divider, Row, Col, List } from "antd";
import { saveStudentCode } from "../Endpoints/StudentMarks";
import MarksInput from "./MarksInput";

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

const Output = ({ language, editorRef, assignment, studentId, marks }) => {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { assignmentCode } = useParams();

  const handleRunCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    setOutput("...compiling");
    const { run } = await runCode(language, sourceCode);
    setError(run.stderr);
    setOutput(run.stdout);
  };

  const handleSubmit = () => {
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
      <div className="d-flex align-items-center">
        <button className="run-code" onClick={handleRunCode}>
          Run Code
        </button>{" "}
        &nbsp; &nbsp;
        {!studentId ? (
          <button className="submit-code" onClick={handleSubmit}>
            Submit
          </button>
        ) : (
          <MarksInput studentId={studentId} markss={marks} />
        )}
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
            <div>{assignment?.title}</div>
            <Tag color={getDifficultyColor(assignment?.difficulty)}>
              {assignment?.difficulty}
            </Tag>
          </div>
        }
        bordered={true}
        style={{
          height: "47vh",
          width: "100%",
          marginBottom: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflowY: "auto",
        }}
      >
        {/* Description */}
        <Text strong>Description:</Text>
        <Text style={{ display: "block", marginBottom: "16px" }}>
          {assignment?.description}
        </Text>

        <Divider />

        {/* Test Cases */}
        <Text strong>Test Cases:</Text>
        <List
          style={{ marginBottom: "16px" }}
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
                  <Text strong>Input:</Text> <Text>{testCase.input}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Output:</Text> <Text>{testCase.output}</Text>
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
        <Text strong>Constraints:</Text>
        <Text style={{ display: "block", marginBottom: "16px" }}>
          {assignment?.constraints}
        </Text>

        {/* Tags */}
        <Text strong>Tags:</Text>
        <div style={{ marginBottom: "16px" }}>
          {assignment?.tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </div>
      </Card>
      <div className={`output ${error && "error-output"}`}>
        {error != ""
          ? error
          : output != ""
          ? output
          : "//Run code to show output here"}
      </div>
    </>
  );
};

export default Output;
