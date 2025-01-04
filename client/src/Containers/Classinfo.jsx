import { Segmented, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAssignmentsByClassCode,
  getDashboardAssignmentByClassCode,
  getStudentsByClassCode,
} from "../Endpoints/Assignment";
import {
  columnsAssignments,
  columnsStudent,
  columnSubmissions,
} from "../constants";
import { PhoneFilled } from "@ant-design/icons";
import { getSubmissionsByClassCode } from "../Endpoints/StudentMarks";

const tabs = ["Assignments", "Students", "Submissions"];
const difficultyColors = {
  Easy: "green",
  Medium: "orange",
  Hard: "red",
};

const Classinfo = () => {
  const [tab, setTab] = useState("Assignments");
  const [tableData, setTableDate] = useState([]);
  const [tableDataStudent, setTableDateStudent] = useState([]);
  const [submissionsData, setSubmissionsData] = useState([]);
  const { classCode } = useParams();

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleMarking = (studentId, assignmentId) => {
    window.open(
      `${import.meta.env.VITE_UI_BASE_URL}/discussion/${classCode}/${studentId}/${assignmentId}`
    );
  };

  useEffect(() => {
    getDashboardAssignmentByClassCode(classCode)
      .then((res) => {
        const data = res.data;
        const transformedData = data.map((assignment, index) => ({
          key: index + 1,
          serial: index + 1,
          title: assignment.title,
          difficulty: (
            <Tag
              style={{ alignSelf: "flex-start" }}
              color={difficultyColors[assignment.difficulty] || "default"}
            >
              {assignment.difficulty}
            </Tag>
          ),
          tags: assignment.tags.map((tag) => (
            <Tag key={tag.trim()} color="blue" style={{ marginBottom: "4px" }}>
              {tag.trim()}
            </Tag>
          )),
          submissions: `${assignment.studentCount}`,
        }));

        setTableDate(transformedData);
      })
      .then((err) => {
        console.log(err);
      });

    getStudentsByClassCode(classCode)
      .then((res) => {
        const data = res.data;

        const transformedData = data.map((item, index) => ({
          serial: index + 1,
          name: item.name,
          email: item.email,
          action: <PhoneFilled />,
          isOnline: "*",
        }));

        setTableDateStudent(transformedData);
      })
      .catch((err) => {
        console.log(err);
      });

    getSubmissionsByClassCode(classCode)
      .then((res) => {
        const data = res.data;
        const transformedData = data.map((item, index) => ({
          serial: index + 1,
          name: item.studentName,
          title: (
            <div
              onClick={() => handleMarking(item?.studentId, item?.assignmentId)}
              className="link-text"
            >
              {item.assignmentTitle}
            </div>
          ),
          marks: item?.marks ? `${item?.marks} / 10` : "-",
        }));
        setSubmissionsData(transformedData);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="class-info">
      <Segmented
        options={tabs}
        onChange={(value) => {
          setTab(value);
        }}
      />

      {tab == "Students" ? (
        <div style={{ width: "80%", margin: "16px 0" }}>
          <Table
            columns={columnsStudent}
            dataSource={tableDataStudent}
            onChange={onChange}
          />
        </div>
      ) : tab == "Assignments" ? (
        <div style={{ width: "80%", margin: "16px 0" }}>
          <Table
            columns={columnsAssignments}
            dataSource={tableData}
            onChange={onChange}
          />{" "}
        </div>
      ) : (
        <div style={{ width: "80%", margin: "16px 0" }}>
          <Table
            columns={columnSubmissions}
            dataSource={submissionsData}
            onChange={onChange}
          />{" "}
        </div>
      )}
    </div>
  );
};

export default Classinfo;
