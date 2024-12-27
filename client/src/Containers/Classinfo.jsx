import { Segmented, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssignmentsByClassCode, getDashboardAssignmentByClassCode } from "../Endpoints/Assignment";

const tabs = ["Assignments", "Students"];
const difficultyColors = {
  Easy: "green",
  Medium: "orange",
  Hard: "red",
};

const Classinfo = () => {
  const [tab, setTab] = useState(1);
  const [tableData, setTableDate] = useState([])
  const { classCode }= useParams();
  const columns = [
    {
      title: "S.No",
      dataIndex: "serial",
      width : 150,
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      width : 200
      //   sorter: {
      //     compare: (a, b) => a.chinese - b.chinese,
      //     multiple: 3,
      //   },
    },
    {
      title: "Tags",
      dataIndex: "tags",
      width : 200
    },
    {
      title: "Submissions",
      dataIndex: "submissions",
      width : 200
      //   sorter: {
      //     compare: (a, b) => a.math - b.math,
      //     multiple: 2,
      //   },
    },
    // {
    //   title: 'English Score',
    //   dataIndex: 'english',
    //   sorter: {
    //     compare: (a, b) => a.english - b.english,
    //     multiple: 1,
    //   },
    // },
  ];
  const data = [
    {
      key: "1",
      serial: 1,
      title: "John Brown",
      difficulty: "easy",
      tags : "Arrays",
      submissions: "34/46",
    },
    {
      key: "1",
      serial: 1,
      title: "John Brown",
      difficulty: "easy",
      tags : "Arrays",
      submissions: "34/46",
    },
    {
      key: "1",
      serial: 1,
      title: "John Brown",
      difficulty: <div style={{color : "red"}}>easy</div>,
      tags : "Arrays",
      submissions: "34/46",
    },
    {
      key: "1",
      serial: 1,
      title: "John Brown",
      difficulty: "easy",
      tags : "Arrays",
      submissions: "34/46",
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };


  useEffect(() => {
    getDashboardAssignmentByClassCode(classCode).then(res => {
      const data = res.data;
      console.log(data)
      const transformedData = data.map((assignment, index) => ({
        key: index + 1,
        serial: index + 1,
        title: assignment.assignmentTitle,
        difficulty: (
          <Tag
            style={{ alignSelf: "flex-start" }}
            color={difficultyColors[assignment.difficulty] || "default"}
          >
            {assignment.difficulty}
          </Tag>
        ),
        tags: assignment.assignmentTags.map((tag) => (
          <Tag key={tag.trim()} color="blue" style={{ marginBottom: "4px" }}>
            {tag.trim()}
          </Tag>
        )),
        submissions: `${assignment.students.length}`,
      }));
      
      console.log(transformedData)
      setTableDate(transformedData)
    }).then(err => {
      console.log(err)
    })
  }, [])
  return (
    <div className="class-info">
      <Segmented
        options={tabs}
        onChange={(value) => {
          setTab(value);
        }}
      />

      {tab == "Students" ? (
        <div>
          <Table columns={columns} dataSource={tableData} onChange={onChange} />
        </div>
      ) : (
        <div>
          <Table columns={columns} dataSource={tableData} onChange={onChange} />{" "}
        </div>
      )}
    </div>
  );
};

export default Classinfo;
