import React, { useEffect, useState } from "react";
import {
  createClassroom,
  getClassroomsByEducatorId,
} from "../Endpoints/Classroom";
import { isEducator } from "../Helpers";
import { useNavigate } from "react-router-dom";
import ClassroomModal from "../Components/ClassroomModal";
import { isEmptyArray } from "formik";

const EducatorDashboard = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [classroom, setClassroom] = useState({});
  const [create, setCreate] = useState(true);
  const navigate = useNavigate();

  const handleClick = (classCode) => {
    navigate(`/class-info/${classCode}`);
  };

  useEffect(() => {
    getClassroomsByEducatorId()
      .then((res) => {
        setClassrooms(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFormSubmit = (values) => {
    const payload = {
      Name: values.title,
      Description: values.description,
    };

    createClassroom(payload)
      .then((res) => {
        setClassroom(res.data.classroom);
        setCreate(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setCreate(true);
    setModalOpen(false);

    getClassroomsByEducatorId()
      .then((res) => {
        setClassrooms(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="dashboard-container">
      <div className="code-meet-create-assign">
        <div className="assignments-heading">Classes</div>
        {isEducator() && (
          <button
            className="create-button"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            + Create Class
          </button>
        )}
      </div>
      <div className="d-flex justify-content-start flex-wrap">
        {isEmptyArray(classrooms) && <div style={{color : "gray", fontSize : "14px"}}>No classes found</div>}
        {classrooms.map((item) => {
          return (
            <div
              className="class-card"
              onClick={() => handleClick(item._doc.classCode)}
            >
              <div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="class-name">{item?._doc?.name}</div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `${import.meta.env.VITE_UI_BASE_URL}/classroom/${
                          item._doc.classCode
                        }`
                      );
                    }}
                    className="create-class-create"
                  >
                    Join
                  </div>
                </div>
                <div className="class-desc">{item?._doc?.description}</div>
              </div>

              <div className="d-flex w-100 justify-content-between">
                <div>Assignments: {item?.assignmentCount}</div>
              </div>
            </div>
          );
        })}
      </div>
      <ClassroomModal
        classCode={classroom?.classCode}
        setClassroom={setClassroom}
        setIsModalOpen={setModalOpen}
        // set
        isModalOpen={modalOpen}
        handleCancel={handleCancel}
        handleFormSubmit={handleFormSubmit}
        create={create}
        setCreate={setCreate}
      />
    </div>
  );
};

export default EducatorDashboard;
