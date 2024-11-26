import { Button } from "antd";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../Endpoints/Auth";
import google from "../assets/google.png";
import apple from "../assets/apple-logo.png";
import leftMain from "../assets/leftMain.jpg";

const Login = () => {
  const navigate = useNavigate();
  const OnFormSubmit = (values) => {
    loginRequest(values)
      .then((res) => {
        console.log(res, "lelres");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("role", res.data.userRole);
        if (res.status == 200) {
          navigate("/home");
        }
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
          <div className="Login-main">Glad to see ya!!</div>
          <Formik
            initialValues={{
              email: "",
              password: "",
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
                  name="email"
                  type="text"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Email Id"
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
                <button className="login-button" type="submit">
                  Login
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
                  className="login-opp-text"
                  onClick={() => navigate("/register")}
                >
                  New here? Register
                </u>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
