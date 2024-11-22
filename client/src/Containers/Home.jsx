import coding from "../assets/coding.png";
import realtime from "../assets/real-time.png";
import videoChat from "../assets/video-call.png";
import settings from "../assets/settings.png";
import React, { useEffect, useState } from "react";
import ClassroomModal from "../Components/ClassroomModal";
import {
  createClassroom,
  getClassroomByCode,
  getClassroomsById,
} from "../Endpoints/Classroom";
import Classroom from "./Classroom";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classroom, setClassroom] = useState(null);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   getClassroomsById().then(res => {
  //     console.log(res, "coderes")
  //     setClassroom(res.data.classrooms);
  //   }).catch((err) => {
  //     console.log(err);
  //   })
  // }, [])

  const showModal = () => {
    if (!localStorage.getItem("userId")) {
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };
  const handleFormSubmit = (values) => {
    const payload = {
      Name: values.title,
      Description: values.description,
    };

    createClassroom(payload)
      .then((res) => {
        setClassroom(res.data.classroom);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleJoin = () => {
    getClassroomByCode(code)
      .then((res) => {
        console.log("reseafeft");
        if (res.status == 200) {
          navigate(`/classroom/${code}`);
        }
      })
      .catch((err) => {
        if(err.status == 401) {
          navigate("/login");
        }
      });
  };

  return (
    <div className="home-container">
      <div className="create-meet-container">
        <div className="heading-container">
          <div className="heading">Real-Time Coding Classes for Everyone</div>
          <p className="subheading">
            Create, teach, and collaborate with your students in an interactive
            coding environment.
          </p>
          <div className="create-input">
            <div className="create-button" onClick={showModal}>
              Create a Class
            </div>{" "}
            &nbsp; &nbsp;
            <input
              type="text"
              maxLength="6"
              style={{ fontSize: "1rem", width: "180px", marginRight: "16px" }}
              placeholder="Enter code to join"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {!code ? (
              <button
                disabled
                style={{
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: "white",
                }}
              >
                join
              </button>
            ) : (
              <button
                style={{
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: "white",
                }}
                onClick={handleJoin}
              >
                join
              </button>
            )}
          </div>
        </div>
      </div>
      <ClassroomModal
        classCode={classroom?.classCode}
        setClassroom={setClassroom}
        setIsModalOpen={setIsModalOpen}
        set
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleFormSubmit={handleFormSubmit}
      />
      <div className="create-meet-image">
        <div className="feature-content">
          <div className="feature-title">
            What We Offer
            <div className="feature-title-desc">
              Explore the key features that make teaching and learning code
              easier, faster, and more interactive.
            </div>
          </div>
          <div className="feature-box">
            <div className="feature-info">
              {" "}
              <img className="feature-image" src={coding} /> <br />
              Interactive Code Editor
              <div className="feature-desc">
                Enable students to write and execute code instantly in a
                collaborative coding environment.
              </div>
            </div>
            <div className="feature-info">
              {" "}
              <img className="feature-image" src={realtime} /> <br />
              Real-Time Collaboration
              <div className="feature-desc">
                Teachers and students can code and communicate in real time,
                enhancing the learning experience.
              </div>
            </div>
            <div className="feature-info">
              {" "}
              <img className="feature-image" src={settings} /> <br />
              Customizable Class Setup
              <div className="feature-desc">
                Easily set up coding sessions with personalized class settings
                and project templates.
              </div>
            </div>
            <div className="feature-info">
              {" "}
              <img className="feature-image" src={videoChat} /> <br />
              Video calling and chat
              <div className="feature-desc">
                Teachers can monitor progress and provide immediate help to
                students as they code.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
