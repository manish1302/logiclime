import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./Containers/Login";
import Home from "./Containers/Home";
import Register from "./Containers/Register";
import Dashboard from "./Containers/Dashboard";
import Classroom from "./Containers/Classroom";
import Navbar from "./Components/Navbar";
import CodeMeet from "./Containers/CodeMeet";
import Landingpage from "./Containers/Landingpage";
import PlayGround from "./Containers/PlayGround";
import EducatorDashboard from "./Containers/EducatorDashboard";
import Classinfo from "./Containers/Classinfo";
import StudentDashboard from "./Containers/StudentDashboard";
import Discussion from "./Containers/Discussion";
import { initializeOnlineSocket } from "./socket";
import { useEffect, useRef, useState } from "react";
import { isEducator, isStudent } from "./Helpers";

const NavbarWrapper = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register"];

  return !hideNavbarPaths.includes(location.pathname) ? <Navbar /> : null;
};

const App = () => {
  const onlineSocket = useRef(null);
  const [onlineStudents, setOnlineStudents] = useState([]);

  useEffect(() => {
    onlineSocket.current = initializeOnlineSocket();
    onlineSocket.current.on("joined", ({ message, onlineStudents }) => {
      console.log(message, onlineStudents, "joined");
      setOnlineStudents(onlineStudents);
    });
    onlineSocket.current.on("connect", () => {
      onlineSocket.current.emit("join", {
        roomId: "online",
        userId: localStorage.getItem("userId"),
        email: localStorage.getItem("email"),
      });
    });
    onlineSocket.current.on("disconnected", ({onlineStudents}) => {
      setOnlineStudents(onlineStudents);
    });

    return () => {
      if (onlineSocket.current?.connected) {
        onlineSocket.current.removeAllListeners();
        onlineSocket.current.close();
      }
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <BrowserRouter>
        <NavbarWrapper />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/educator-dashboard" element={<EducatorDashboard />} />
          {/* <Route
            path="/dashboard"
            element={
              localStorage.getItem("role") == "Student" ? (
                <StudentDashboard />
              ) : (
                <EducatorDashboard />
              )
            }
          /> */}
          <Route path="/classroom/:classCode" element={<CodeMeet />} />
          <Route
            path="/classroom/:classCode/:assignmentCode"
            element={<PlayGround />}
          />
          <Route
            path="/discussion/:classCode/:studentId/:assignmentCode"
            element={<Discussion />}
          />
          <Route
            path="/discussion/:classCode/:assignmentCode"
            element={<Discussion />}
          />
          <Route path="/class-info/:classCode" element={<Classinfo onlineStudents={onlineStudents} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
