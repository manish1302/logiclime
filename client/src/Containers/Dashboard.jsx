import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { createClassroom, getClassroomsById } from "../Endpoints/Classroom";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    getClassroomsById().then((res) => {
      setClasses(res.data.classrooms);
    }).catch(err => console.log(err));
  }, [])

  const OnFormSubmit = (values) => {
    const payload = values;
    createClassroom(payload)
      .then((res) => {
      })
      .catch((e) => {
        console.log(e);
      });
  };


  return (
    <div>
      CreateClassroom
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

      {classes.map((item, id) => (
        <div onClick={() => {
          navigate(`/classroom/${item._id}`)
        }} style={{color : "red"}} key = {id}>
          {item.name} - {item.description}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
