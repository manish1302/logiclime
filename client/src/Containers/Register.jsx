import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../Endpoints/Auth";
import leftMain from "../assets/leftMain.jpg";
import google from "../assets/google.png";
import apple from "../assets/apple-logo.png";
import DropdownComp from "../Components/Dropdown";

const Register = () => {
  const navigate = useNavigate();

  const OnFormSubmit = (values) => {
    const payload = {
      firstName: values.firstName,
      secondName: values.secondName,
      role: values.role,
      email: values.email,
      password: values.password,
    };

    console.log(import.meta.env.VITE_API_BASE_URL, "base");

    registerRequest(payload)
      .then((res) => {
        navigate("/login");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="login-container">
      <div className="left-login">
        <img src={leftMain} className="left-image" />
      </div>
      <div className="right-login">
        <div className="right-login-box">
          <div className="Login-main">Welcome, get started !!</div>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              role: "Student",
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
            {({
              values,
              setFieldValue,
              errors,
              touched,
              handleChange,
              handleSubmit,
            }) => (
              <Form onSubmit={handleSubmit} className="login-form">
                <div className="names-field">
                  <Field
                    name="firstName"
                    type="text"
                    value={values.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="login-fields"
                    style={{ marginRight: "16px" }}
                  />
                  <Field
                    name="secondName"
                    type="text"
                    value={values.secondName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="login-fields"
                  />
                </div>
                <DropdownComp
                  className="login-fields"
                  setFieldValue={setFieldValue}
                  values={values}
                  fieldName="role"
                  items = {["Educator", "Student"]}
                />
                <Field
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="login-fields"
                />
                <Field
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="login-fields"
                />
                <button type="submit" className="login-button">
                  Register
                </button>
                <div className="social-login-box">
                  <button className="social-login-button">
                    <img src={google} alt="" style={{ height: "10px" }} />{" "}
                    &nbsp; Google
                  </button>
                  <button className="social-login-button">
                    <img src={apple} alt="" style={{ height: "15px" }} /> &nbsp;
                    Apple
                  </button>
                </div>
                <u
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="login-opp-text"
                >
                  Already a user?
                </u>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;
