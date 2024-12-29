import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { addmarks } from "../Endpoints/StudentMarks";

const MarksInput = ({ studentId, markss}) => {
  const [marks, setMarks] = useState(markss);
  const [isEditable, setIsEditable] = useState(true);

  const handleMarksChange = (e) => {
    setMarks(e.target.value);
  };  

  useEffect(() => {
    if(markss) {
      setMarks(markss);
      setIsEditable(false);
    }
  }, [markss])

  const handleSubmit = () => {
    setIsEditable(false);
    addmarks({
      studentId: studentId,
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
        readOnly={!isEditable}
        style={{ width: "100px" }}
        max={10}
        min={0}
        placeholder="Marks"
      />
      {isEditable ? (
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
      )}
    </div>
  );
};

export default MarksInput;
