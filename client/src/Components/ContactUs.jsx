import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_qko0e5c", "template_2tg3l8w", e.target, {
        publicKey: "FquIDkDOjRORHyrtv",
      })
      .then(
        () => console.log("SUCCESS!"),
        (error) => console.log("FAILED...", error.text)
      );
    setSubmitted(true);
  };

  return (
    <div style={{width: "100%", backgroundColor: "#0d1117"}}>
      <div className="contact-container">
        <div className="contact-info">
          <h2>
            Have a <span className="accent">Question?</span>
          </h2>
          <p>
            We’d love to hear from you! Whether you have questions, feedback, or
            need assistance, feel free to reach out.
          </p>
          {submitted && (
            <p className="success-msg">
              Thank you for reaching out! We'll get back to you soon.
            </p>
          )}
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>My name is</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Here is my email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>And my message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Write your message..."
            />
          </div>

          <button type="submit" className="cta-button">
            Send Mail
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
