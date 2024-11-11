import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateAssignment from "./CreateAssignment";

const Classroom = () => {
  const navigate = useNavigate();
  const { classroomId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ backgroundColor: "red", height: "100vh", width: "100vw" }}>
      Assignments <br />
      Notes
      <button onClick={showModal} style={{ backgroundColor: "blue" }}>
        create assignment
      </button>
      <button style={{ backgroundColor: "blue" }}>add notes</button>
      <CreateAssignment 
        isModalOpen = {isModalOpen}
        handleOk = {handleOk}
        handleCancel = {handleCancel}
      />
    </div>
  );
};

export default Classroom;
