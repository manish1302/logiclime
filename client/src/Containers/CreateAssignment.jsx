import { Modal } from "antd";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";

const CreateAssignment = ({ isModalOpen, handleOk, handleCancel }) => {
  const navigate = useNavigate();
  const OnFormSubmit = () => {};
  return (
    <Modal
      title="Create assignment"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Formik
        initialValues={{
          Name: "",
          Description: "",
        }}
        validate={(values) => {
          const errors = {};
          // Add validation logic here if needed
          return errors;
        }}
        onSubmit={(values) => {
          OnFormSubmit(values);
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="login-form">
            <Field
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
              placeholder="Title"
              className="login-fields"
            />
            <Field
              name="description"
              type="text"
              value={values.description}
              onChange={handleChange}
              placeholder="Description"
              className="login-fields"
            />
            <Field
              name="url"
              type="text"
              value={values.url}
              onChange={handleChange}
              placeholder="Description"
              className="login-fields"
            />
            <div>
              <div onClick={() => navigate(-1)} style={{ color: "black" }}>
                Cancel
              </div>
              <div
                onClick={() => OnFormSubmit(values)}
                style={{ color: "black" }}
              >
                Create
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateAssignment;
