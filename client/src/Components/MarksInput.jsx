import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { addmarks } from "../Endpoints/StudentMarks";
import { isStudent } from "../Helpers";

const MarksInput = ({
  studentId,
  marks,
  setMarks,
  setIsEditable,
  isEditable,
  assignmentId,
}) => {
  const handleMarksChange = (e) => {
    setMarks(e.target.value);
  };

  const handleSubmit = () => {
    setIsEditable(false);
    addmarks({
      studentId: studentId,
      assignmentId: assignmentId,
      marks: marks,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleEdit = () => {
    setIsEditable(true);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Input
        type="number"
        value={marks}
        onChange={handleMarksChange}
        readOnly={!isEditable || isStudent()}
        style={{ width: "100px" }}
        max={10}
        min={0}
        placeholder="Marks"
      />
      {!isStudent() &&
        (isEditable ? (
          <Button
            variant="solid"
            icon={<CheckOutlined style={{ color: "white" }} />}
            onClick={handleSubmit}
            disabled={!marks || marks < 0 || marks > 10}
            style={{ backgroundColor: "#00CC00" }}
          ></Button>
        ) : (
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={handleEdit}
          ></Button>
        ))}
    </div>
  );
};

export default MarksInput;
