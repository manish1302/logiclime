import React, { useEffect, useState } from "react";
import { isEducator } from "../Helpers";
import { getClassroomsByStudentId } from "../Endpoints/Classroom";

const StudentDashboard = () => {
  const [classrooms, setClassrooms] = useState([])

  useEffect(() => {
    getClassroomsByStudentId().then(res => {
      setClassrooms(res.data)
    }).catch(err => {
      console.log(err)
          })
  }, [])
  return (
    <div className="dashboard-container">
      <div className="code-meet-create-assign">
        <div className="assignments-heading">Classes</div>
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
      <div className="d-flex justify-content-start flex-wrap">
        {classrooms?.length > 0 ? (
          classrooms?.map((item) => {
            return (
              <div className="student-class-card">
                <div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="class-name">{item?.name}</div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `${import.meta.env.VITE_UI_BASE_URL}/classroom/${
                            item?.classCode
                          }`
                        );
                      }}
                      className="create-class-create"
                    >
                      Join
                    </div>
                  </div>
                  <div className="class-desc">{item?.description}</div>
                </div>
                <div className="d-flex w-100 justify-content-between">
                  <div>Assignments: {item?.numberOfAssignments}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ color: "gray", fontSize: "14px" }}>
            No classes found
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
