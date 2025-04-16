import { Button } from "antd";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../Endpoints/Auth";
import google from "../assets/google.png";
import apple from "../assets/apple-logo.png";
import leftMain from "../assets/leftMain.jpg";
import lemon from "../assets/lemon.png";
import toast, { Toaster } from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const OnFormSubmit = (values) => {
    setLoading(true);
    loginRequest(values)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("email", res.data.emaild);
        localStorage.setItem("role", res.data.userRole);
        if (res.status == 200) {
          navigate("/home");
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
        console.log(err, "login-error");
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <Toaster />
      <div className="left-login">
        <img src={leftMain} className="left-image" />
      </div>
      <div className="right-login">
        <div className="right-login-box">
          <div
            className="logo cursor-pointer"
            style={{ color: "white", fontSize: "16px", marginBottom: "32px" }}
          >
            <img
              style={{ height: "20px", cursor: "pointer", marginRight: "8px" }}
              src={lemon}
              alt=""
            />
            Logic Lime
          </div>
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
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="login-form">
                <div className="d-flex flex-column w-100">
                  <Field
                    name="email"
                    type="text"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Email Id"
                    className="login-fields"
                    style={{ border: errors.email && "1px solid red" }}
                    validate={(value) => {
                      if (!values.email) {
                        return "Email is required";
                      } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                          values.email
                        )
                      ) {
                        return "Invalid email address";
                      } else {
                        return false;
                      }
                    }}
                  />
                  {errors.email && (
                    <div style={{ color: "red" }}>{errors.email}</div>
                  )}
                </div>
                <div className="d-flex flex-column w-100">
                  <Field
                    name="password"
                    type="password"
                    value={values.password}
                    style={{ border: errors.password && "1px solid red" }}
                    onChange={handleChange}
                    placeholder="Password"
                    className="login-fields"
                    validate={(value) => {
                      return [null, undefined, ""].includes(value);
                    }}
                  />
                  {errors.password && (
                    <div style={{ color: "red" }}>Required</div>
                  )}
                </div>
                <button className="login-button" type="submit">
                  Login
                  <RotatingLines
                    strokeColor="white"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="16"
                    visible={loading}
                  />
                </button>
                {/* <div className="social-login-box">
                  <button className="social-login-button">
                    <img src={google} alt="" style={{ height: "10px" }} />{" "}
                    &nbsp; Google
                  </button>
                  <button className="social-login-button">
                    <img src={apple} alt="" style={{ height: "15px" }} /> &nbsp;
                    Apple
                  </button>
                </div> */}
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
