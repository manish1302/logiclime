import React from "react";
import user from "../assets/user.png";
import lemon from "../assets/lemon.png";
import { useNavigate, useParams } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="navbar">
      <div className="logo cursor-pointer" onClick={handleDashboard}>
        <img
          style={{ height: "30px", cursor: "pointer", marginRight: "8px" }}
          src={lemon}
          alt=""
        />
        Logic Lime
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <div className="cursor-pointer" onClick={handleDashboard}>
          Dashboard
        </div>{" "}
        &nbsp; &nbsp;
        <div>
          <img
            style={{ height: "30px", cursor: "pointer" }}
            src={user}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
