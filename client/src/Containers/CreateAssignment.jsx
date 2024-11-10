import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";

const CreateAssignment = () => {
  const navigate = useNavigate();

  const OnFormSubmit = () => {};
  return (
    <div>
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
              name="Name"
              type="text"
              value={values.Name}
              onChange={handleChange}
              placeholder="Name"
              className="login-fields"
            />
            <Field
              name="Description"
              type="text"
              value={values.Description}
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
    </div>
  );
};

export default CreateAssignment;
