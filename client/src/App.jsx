import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Containers/Login";
import Home from "./Containers/Home";
import Register from "./Containers/Register";
import Dashboard from "./Containers/Dashboard";

const App = () => {
  return (
    <div style={{height : '100vh', width: "100vw"}}>
      {/* <SideMenuLayout> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path = "/register" element = {<Register />} />
            <Route path = "/dashboard" element = {<Dashboard />} />
          </Routes>
        </BrowserRouter>
      {/* </SideMenuLayout> */}
    </div>
  );
};

export default App;
