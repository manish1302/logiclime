import axios from "axios";
import { useState } from "react";
import { getAllUsers } from "../Endpoints/Auth";

const Dashboard = () => {
  const [allUser, setAllUsers] = useState([]);
  const handleClick = () => {
    getAllUsers().then((res) => {
      setAllUsers(res.data);
    });
  };
  return (
    <div onClick={handleClick}>
      Dashboard
      {allUser.map((item) => (
        <div key={item._id}>{item.userName}</div>
      ))}
    </div>
  );
};

export default Dashboard;
