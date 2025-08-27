import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import { registerRequest } from "../Endpoints/Auth";
import logo from "../assets/lemon.png";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const OnFormSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        firstName: values.firstName,
        secondName: values.secondName,
        role: values.role,
        email: values.email,
        password: values.password,
      };

      const res = await registerRequest(payload);
      if (res?.status === 200) {
        toast.success("Registered successfully!");
        navigate("/login");
      } else {
        toast.error("Registration failed");
      }
    } catch (err) {
      if (err.status === 400) {
        toast.error("Email Id already registered");
      } else {
        toast.error("Something went wrong");
      }
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-page"
      style={{
        background:
          "linear-gradient(135deg, #0d1117 40%, #121925ff 50%, #0d1117 60%)",
      }}
    >
      <Toaster />
      <div className="register-card">
        <div className="brand">
          <img src={logo} alt="Logic Lime logo" className="brand-logo" />
          <span className="brand-text">Logic Lime</span>
        </div>

        <h2 className="title">Create Account</h2>
        <p className="subtitle">Join as an Educator or Student</p>

        <Formik
          initialValues={{
            firstName: "",
            secondName: "",
            email: "",
            password: "",
            role: "Student",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.firstName) errors.firstName = "Required";
            if (!values.secondName) errors.secondName = "Required";
            if (!values.email) {
              errors.email = "Email is required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email";
            }
            if (!values.password) errors.password = "Required";
            return errors;
          }}
          onSubmit={OnFormSubmit}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ values, errors, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit} noValidate>
              <div className="field-row">
                <div className="field">
                  <Field
                    name="firstName"
                    type="text"
                    value={values.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="login-input"
                  />
                  {errors.firstName && (
                    <div className="error">{errors.firstName}</div>
                  )}
                </div>
                <div className="field">
                  <Field
                    name="secondName"
                    type="text"
                    value={values.secondName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="login-input"
                  />
                  {errors.secondName && (
                    <div className="error">{errors.secondName}</div>
                  )}
                </div>
              </div>

              <div className="field">
                <Field
                  as="select"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  className="login-input"
                >
                  <option value="Student">Student</option>
                  <option value="Educator">Educator</option>
                </Field>
              </div>

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

              <div className="field">
                <Field
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="login-input"
                />
                {errors.password && (
                  <div className="error">{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn-gradient"
                disabled={loading}
              >
                {loading ? (
                  <RotatingLines
                    strokeColor="white"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="20"
                    visible
                  />
                ) : (
                  "Register"
                )}
              </button>

              <div className="login-text">
                <span>Already a user?</span>
                <span
                  className="link"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
