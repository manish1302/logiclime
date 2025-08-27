import { Modal } from "antd";
import { Field, Form, Formik } from "formik";
import { CopyOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const ClassroomModal = ({
  isModalOpen,
  handleFormSubmit,
  handleCancel,
  classCode = false,
  setClassroom,
  setIsModalOpen,
}) => {
  const [copied, setCopied] = useState(null);

  const handleCopy = () => {
    if (classCode) {
      navigator.clipboard
        .writeText(classCode)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset 'copied' after 2 seconds
        })
        .catch((err) => console.error("Error copying text: ", err));
    }
  };

  const handleJoin = () => {
    window.open(`${import.meta.env.VITE_UI_BASE_URL}/classroom/${classCode}`);
    setCreate(true);
    setClassroom(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      {!classCode ? (
        <Formik
          initialValues={{
            title: "",
            description: "",
          }}
          validate={(values) => {
            const errors = {};
            // Add validation logic here if needed
            return errors;
          }}
          onSubmit={(values) => {
            handleFormSubmit(values);
          }}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="classroom-form">
              <Field
                name="title"
                type="text"
                value={values.title}
                onChange={handleChange}
                placeholder="Title"
                className="classroom-fields"
              />
              <Field
                name="description"
                type="text"
                value={values.description}
                onChange={handleChange}
                placeholder="Description"
                className="classroom-fields"
              />
              {/* <Field
                            name="url"
                            type="text"
                            value={values.url}
                            onChange={handleChange}
                            placeholder="Classroom code"
                            className="classroom-fields"
                        /> */}
              <div style={{ width: "100%" }} className="d-flex flex-end">
                <button
                  style={{
                    borderRadius: "8px",
                    background:
                      "linear-gradient(90deg, #06b6d4 0%, #6366f1 100%)",
                    border: "none",
                    padding: "8px 16px",
                    marginRight: "16px",
                  }}
                  type="submit"
                >
                  Create
                </button>
                <button
                  style={{
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    padding: "8px 16px",
                  }}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div
          style={{
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: "6px", fontWeight: 500 }}>
            Here is your class code. Share with someone.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <pre
              style={{
                padding: "7px 14px",
                backgroundColor: "#1e293b",
                borderRadius: "6px",
                margin: 0,
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                color: "#fff",
              }}
            >
              <code className="class-link">{classCode}</code>
            </pre>
            {copied ? (
              <span style={{ color: "#9ca3af", fontSize: "13px" }}>
                Copied!
              </span>
            ) : (
              <CopyOutlined
                className="cursor-pointer"
                style={{
                  color: "#b19cd9",
                  fontSize: "18px",
                  verticalAlign: "middle",
                }}
                onClick={handleCopy}
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button className="create-class-cancel" onClick={handleCancel}>
              later
            </button>
            <button className="create-class-create" onClick={handleJoin}>
              Join
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomModal;
