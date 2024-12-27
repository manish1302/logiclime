import React from "react";
import { isEducator } from "../Helpers";

const StudentDashboard = () => {
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
      <div className="d-flex justify-content-between flex-wrap">
        {classrooms.map((item) => {
          return (
            <div className="class-card">
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

export default StudentDashboard;
