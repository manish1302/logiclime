import React, { useEffect, useState } from "react";
import user from "../assets/user.png";
import lemon from "../assets/lemon.png";
import { useNavigate, useParams } from "react-router-dom";
import { Button, ConfigProvider, Flex, Popover } from "antd";
import { getUserById } from "../Endpoints/Auth";
const text = <span>Profile</span>;

const buttonWidth = 80;

const Navbar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfile = () => {
    getUserById()
      .then((res) => {
        setUserInfo(res?.data);
      })
      .then((err) => {
        console.log(err);
      });
  };

  const content = (
    <div>
      <p>{userInfo.name}</p>
      <p>{userInfo.email}</p>
      <p>{userInfo.role}</p>
      {/* <button onClick={handleLogin}>logout</button> */}
    </div>
  );

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
        <div className="cursor-pointer" onClick={handleLogin}>
          Login
        </div>{" "}
        &nbsp; &nbsp;
        <div className="cursor-pointer" onClick={handleLogin}>
          Logout
        </div>{" "}
        &nbsp; &nbsp;
        <div onClick={handleProfile}>
          <ConfigProvider
            button={{
              style: {
                width: buttonWidth,
                margin: 4,
              },
            }}
          >
            <Popover
              placement="bottom"
              title={text}
              content={content}
              trigger="click"
            >
              <img
                style={{ height: "30px", cursor: "pointer" }}
                src={user}
                alt=""
              />
            </Popover>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
