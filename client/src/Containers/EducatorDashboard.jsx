import React, { useEffect, useState } from "react";
import { getClassroomsByEducatorId } from "../Endpoints/Classroom";
import { isEducator } from "../Helpers";
import { useNavigate } from "react-router-dom";

const EducatorDashboard = () => {
  const [modalKey, setModalKey] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();

  const handleClick = (classCode) => {
    navigate(`/class-info/${classCode}`)
  }

  useEffect(() => {
    getClassroomsByEducatorId()
      .then((res) => {
        setClassrooms(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="code-meet-create-assign">
        <div className="assignments-heading">Classes</div>
        {isEducator() && <button
          className="create-button"
          onClick={() => {
            setModalKey((prevKey) => prevKey + 1);
            setIsModalOpen(true);
          }}
        >
          + Create Class
        </button>}
      </div>
      <div className="d-flex justify-content-start flex-wrap">
        {classrooms.map((item) => {
          return (
            <div className="class-card" onClick={() => handleClick(item._doc.classCode)}>
              <div>
                <div className="class-name">{item?._doc?.name}</div>
                <div className="class-desc">{item?._doc?.description}</div>
              </div>
              <div className="d-flex w-100 justify-content-between">
                <div>Assignments: {item?.assignmentCount}</div>
                <div>Students: 34</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EducatorDashboard;
