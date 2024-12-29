import { CopyOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClassroomByCode } from "../Endpoints/Classroom";
import LanguageMenu from "../Components/LanguageMenu";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS, LANGUAGES } from "../constants";
import { Button } from "antd";
import { Editor } from "@monaco-editor/react";
import Output from "../Components/Output";
import AssignmentModal from "../Components/AssignmentModal";
import AssignmentCard from "../Components/AssignmentCard";
import {
  getAssignmentsByClassCode,
  saveAssignments,
} from "../Endpoints/Assignment";
import { isEducator } from "../Helpers";
import { getAssignmentMarks } from "../Endpoints/StudentMarks";

const CodeMeet = () => {
  const { classCode } = useParams();
  const [copied, setCopied] = useState(null);
  const [classroomData, setClassroomData] = useState({});
  const [educatorData, setEducatorData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = React.useState(0);
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getClassroomByCode(classCode).then((res) => {
      setClassroomData(res.data.classroom);
      setEducatorData(res.data.educator);
    });

    getAssignmentsByClassCode(classCode)
      .then(async (res) => {
        const transformedData = await Promise.all(
          res?.data?.message.map(async (item) => {
            try {
              const marksRes = await getAssignmentMarks(item._id);
              return {
                ...item,
                marks: marksRes?.data?.marks,
                Success : marksRes?.data?.Success
              };
            } catch (err) {
              console.log(err);
              return {
                ...item,
                marks: null,
              };
            }
          })
        );

        setAssignments(transformedData);
      })
      .catch((err) => {
        console.log(err);
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

  const showModal = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (!token) {
      navigate("/login");
      return;
    }
    if (userRole == "Educator") {
      setIsModalOpen(true);
    } else {
      openNotification();
    }
  };

  const handleCancel = () => {
    setModalKey((prevKey) => prevKey + 1);
    setIsModalOpen(false);
  };

  const handleFormSubmit = (values) => {
    const payload = {
      ...values,
      classCode: classCode,
    };
    setModalKey((prevKey) => prevKey + 1);
    setIsModalOpen(false);
    saveAssignments(payload)
      .then((res) => {
        setAssignments([...assignments, res.data.message]);
      })
      .catch((err) => {
        console.log(err, "errr");
      });
  };

  const handleSolve = (assignmentId) => {
    navigate(`/classroom/${classCode}/${assignmentId}`);
  };

  return (
    <div className="code-meet-container">
      <div className="code-meet-header">
        <div className="d-flex align-items-center">
          <div className="code-meet-heading">{classroomData?.name}</div>
          <div className="d-flex align-items-center code-copy">
            <pre
              style={{
                padding: "2px 10px",
                backgroundColor: "#f4f4f4",
                borderRadius: "5px",
                width: "fit-content",
                marginRight: "8px",
                marginBottom: 0,
                marginTop: "2px",
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
          <div className="educator-heading text-muted">Educator: </div>&nbsp;
          <div className="educator-heading">
            {educatorData.firstName} {educatorData.secondName}
          </div>
        </div>
      </div>
      <div className="code-meet-desc">{classroomData?.description}</div>
      <div className="code-meet-create-assign">
        <div className="assignments-heading">Assignments</div>
        {isEducator() && (
          <button
            className="create-button"
            onClick={() => {
              setModalKey((prevKey) => prevKey + 1);
              setIsModalOpen(true);
            }}
          >
            + Create assignment
          </button>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          padding: "24px",
          backgroundColor: "#f0f2f5",
        }}
      >
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment._id}
            title={assignment.title}
            difficulty={assignment.difficulty}
            tags={assignment.tags}
            onSolve={() => handleSolve(assignment._id)}
            marks = {assignment.marks}
            submitted = {assignment.Success}
          />
        ))}
      </div>
      <AssignmentModal
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleFormSubmit={handleFormSubmit}
        modalKey={modalKey}
      />
    </div>
  );
};

export default CodeMeet;
