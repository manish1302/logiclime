import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Containers/Login";
import Home from "./Containers/Home";
import Register from "./Containers/Register";
import Dashboard from "./Containers/Dashboard";
import Classroom from "./Containers/Classroom";
import Navbar from "./Components/Navbar";
import CodeMeet from "./Containers/CodeMeet";
import Landingpage from "./Containers/Landingpage";

const App = () => {
  return (
    <div style={{ height: '100vh', width: "100vw" }}>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classroom/:classCode" element={<CodeMeet />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
