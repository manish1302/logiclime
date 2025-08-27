import React, { useState } from "react";
import ClassroomModal from "../Components/ClassroomModal";
import { createClassroom } from "../Endpoints/Classroom";
import { joinClassroom } from "../Endpoints/Assignment";
import { useNavigate } from "react-router-dom";
import { isEducator } from "../Helpers";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Input, notification, Typography, Space, Card } from "antd";

const { Title, Text } = Typography;

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classroom, setClassroom] = useState(null);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: "Only Educators can create a class",
      description: "Change your role to an Educator",
      icon: <SmileOutlined style={{ color: "#38bdf8" }} />,
    });
  };

  const showModal = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (!token) {
      navigate("/login");
      return;
    }
    if (userRole === "Educator") {
      setIsModalOpen(true);
    } else {
      openNotification();
    }
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
    setClassroom(null);
    setIsModalOpen(false);
  };

  const handleJoin = () => {
    joinClassroom({ code })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
    window.open(`${import.meta.env.VITE_UI_BASE_URL}/classroom/${code}`);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen relative"
      style={{
        background:
          "linear-gradient(135deg, #0d1117 40%, #121925ff 50%, #0d1117 60%)",
        padding: "2rem",
      }}
    >
      {contextHolder}

      <Card
        style={{
          maxWidth: 460,
          width: "100%",
          padding: "2rem",
          borderRadius: "1rem",
          background: "rgb(13, 17, 23, 0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div style={{ textAlign: "center" }}>
            <Title
              level={3}
              style={{
                marginBottom: "0.25rem",
                color: "white",
              }}
            >
              {isModalOpen ? "Create a class" : "Join or Create a Class"}
            </Title>
            <Text style={{ color: "#94a3b8" }}>
              {isModalOpen
                ? "Fill in the details to create a new class"
                : "Create a new class or join with a code"}
            </Text>
          </div>

          {isModalOpen && (
            <ClassroomModal
              classCode={classroom?.classCode}
              setClassroom={setClassroom}
              setIsModalOpen={setIsModalOpen}
              isModalOpen={isModalOpen}
              handleCancel={handleCancel}
              handleFormSubmit={handleFormSubmit}
            />
          )}

          {isEducator() && !isModalOpen && (
            <Button
              type="primary"
              block
              size="large"
              style={{
                borderRadius: "8px",
                background: "linear-gradient(90deg, #06b6d4 0%, #6366f1 100%)",
                border: "none",
              }}
              onClick={showModal}
            >
              Create a Class
            </Button>
          )}

          {!isModalOpen && (
            <div>
              <Input
                placeholder="Enter class code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  fontSize: "1rem",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                  marginBottom: "1rem",
                }}
                className="custom-input"
              />

              <Button
                block
                size="large"
                style={{
                  borderRadius: "8px",
                  background: code
                    ? "linear-gradient(90deg, #06b6d4 0%, #6366f1 100%)"
                    : "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "none",
                  cursor: code ? "pointer" : "not-allowed",
                }}
                disabled={!code}
                onClick={handleJoin}
              >
                Join
              </Button>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default Home;
