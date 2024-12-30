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
  setIsModalOpen
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
    setCreate(true)
    setClassroom(null);
    setIsModalOpen(false);
  }

  return (
    <Modal
      title="Clasroom Details"
      footer={<></>}
      centered
      open={isModalOpen}
      onCancel={handleCancel}
    >
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
                <button className="create-class-cancel" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="create-class-create" type="submit">
                  Create
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div>
          Here is your class code. Share with with someone.
          <div className="d-flex align-items-center">
            <pre
              style={{
                padding: "10px",
                backgroundColor: "#f4f4f4",
                borderRadius: "5px",
                width: "fit-content",
                marginRight: "8px",
              }}
            >
              <code className="class-link">{classCode}</code>
            </pre>{" "}
            {copied ? (
              <div style={{ color: "grey" }}>Copied!</div>
            ) : (
              <CopyOutlined
                className="cursor-pointer"
                style={{ color: "grey" }}
                onClick={handleCopy}
              />
            )}
          </div>
          <div style={{ width: "100%" }} className="d-flex flex-end">
            <button className="create-class-cancel" onClick={handleCancel}>
              later
            </button>
            <button className="create-class-create" onClick={handleJoin}>
              Join
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ClassroomModal;
