import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../Endpoints/Auth";
import leftMain from "../assets/leftMain.jpg";
import lemon from "../assets/lemon.png";
import toast, { Toaster } from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

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
    <div
      className="login-page"
      style={{
        background:
          "linear-gradient(135deg, #0d1117 40%, #121925ff 50%, #0d1117 60%)",
      }}
    >
      <Toaster />
      <div className="login-card">
        {/* Logo / Brand */}
        <div className="brand">
          <img src={lemon} alt="Logic Lime logo" className="brand-logo" />
          <span className="brand-text">Logic Lime</span>
        </div>

        {/* Titles */}
        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">Login to continue your journey</p>

        {/* Formik Form */}
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Email is required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            if (!values.password) {
              errors.password = "Password is required";
            }
            return errors;
          }}
          onSubmit={(values) => {
            OnFormSubmit(values);
          }}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ values, errors, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="login-form" noValidate>
              {/* Email */}
              <div className="field">
                <Field
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="login-input"
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className="ps-field">
                <div>
                  <Field
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    placeholder="Password"
                    style = {{paddingRight : passwordVisible ? '40px' : '38px'}}
                    className="login-input"
                  />
                  {errors.password && <div className="error">Required</div>}
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className="password-toggle-icon"
                    style={{right : passwordVisible ? '10px' : '11px'}}
                    onClick={togglePasswordVisibility}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button className="btn-gradient" type="submit" disabled={loading}>
                {loading ? (
                  <RotatingLines
                    strokeColor="white"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="20"
                    visible
                  />
                ) : (
                  "Login"
                )}
              </button>

              {/* Register Link */}
              <div className="register-text">
                <span>New here?</span>
                <span className="link" onClick={() => navigate("/register")}>
                  Register
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
