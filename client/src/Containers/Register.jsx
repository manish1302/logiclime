import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../Endpoints/Auth";
import leftMain from "../assets/leftMain.jpg";
import google from "../assets/google.png";
import apple from "../assets/apple-logo.png";
import DropdownComp from "../Components/Dropdown";
import { useState } from "react";
import { Button, message, Space } from "antd";
import lemon from "../assets/lemon.png";

const Register = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const errorMessage = () => {
    messageApi.open({
      type: "error",
      content: "Email Id already registered",
    });
  };

  const OnFormSubmit = (values) => {
    const payload = {
      firstName: values.firstName,
      secondName: values.secondName,
      role: values.role,
      email: values.email,
      password: values.password,
    };

    registerRequest(payload)
      .then((res) => {
        navigate("/login");
      })
      .catch((err) => {
        if (err.status == 400) {
          errorMessage();
        }
        console.log(err);
      });
  };
  return (
    <div className="login-container">
      {contextHolder}
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
              return errors;
            }}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values) => {
              OnFormSubmit(values);
            }}
          >
            {({
              values,
              setFieldValue,
              errors,
              setErrors,
              touched,
              handleChange,
              handleSubmit,
            }) => {
              console.log(errors);
              return (
                <Form onSubmit={handleSubmit} className="login-form">
                  <div className="names-field">
                    <div
                      className="d-flex flex-column"
                      style={{ width: "48%" }}
                    >
                      <Field
                        name="firstName"
                        type="text"
                        value={values.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="login-fields"
                        style={{
                          marginRight: "16px",
                          border: errors.firstName && "1px solid red",
                        }}
                        validate={(value) => {
                          return [null, undefined, ""].includes(value)
                            ? "Required"
                            : !/^[a-zA-Z]*$/g.test(value)
                            ? "Invalid Name"
                            : false;
                        }}
                      />
                      {errors.firstName && (
                        <div style={{ color: "red" }}>{errors.firstName}</div>
                      )}
                    </div>
                    <div
                      className="d-flex flex-column"
                      style={{ width: "48%" }}
                    >
                      <Field
                        name="secondName"
                        type="text"
                        value={values.secondName}
                        onChange={handleChange}
                        style={{ border: errors.secondName && "1px solid red" }}
                        placeholder="Last Name"
                        className="login-fields"
                        validate={(value) => {
                          return [null, undefined, ""].includes(value)
                            ? "Required"
                            : !/^[a-zA-Z]*$/g.test(value)
                            ? "Invalid Name"
                            : false;
                        }}
                      />
                      {errors.secondName && (
                        <div style={{ color: "red" }}>{errors.secondName}</div>
                      )}
                    </div>
                  </div>
                  <DropdownComp
                    className="login-fields"
                    setFieldValue={setFieldValue}
                    values={values}
                    fieldName="role"
                    items={["Educator", "Student"]}
                  />

                  <div className="d-flex flex-column w-100">
                    <Field
                      name="email"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      style={{ border: errors.email && "1px solid red" }}
                      placeholder="Email"
                      className="login-fields"
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
                  <button type="submit" className="login-button">
                    Register
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
                    onClick={() => {
                      navigate("/login");
                    }}
                    className="login-opp-text"
                  >
                    Already a user?
                  </u>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Register;
