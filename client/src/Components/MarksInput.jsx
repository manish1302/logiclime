import React, { useState } from "react";
import { Input, Button } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";

const MarksInput = () => {
  const [marks, setMarks] = useState("");
  const [isEditable, setIsEditable] = useState(true);

  const handleMarksChange = (e) => {
    setMarks(e.target.value);
  };

  const handleSubmit = () => {
    setIsEditable(false);
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
        disabled={!isEditable}
        style={{ width: "70px" }}
        max={10}
        min={0}
        placeholder="Marks"
      />
      {isEditable ? (
        <Button
          variant="solid"
          icon={<CheckOutlined style={{color : "white"}}/>}
          onClick={handleSubmit}
          disabled={!marks || marks < 0 || marks > 10}
          style={{backgroundColor : "#00CC00"}}
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
