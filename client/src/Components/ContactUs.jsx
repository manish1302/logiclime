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
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
    setSubmitted(true);
  };

  return (
    <div className="contact-us">
      <h2 style={{ fontSize: "2rem" }}>
        Have a{" "}
        <span style={{ color: "#b19cd9", fontSize: "2rem" }}>Question?</span>
      </h2>
      <p>
        We’d love to hear from you! Whether you have questions, feedback, or
        need assistance, feel free to reach out.
      </p>
      
      <h3>Contact Form</h3>
      {submitted && (
        <p> Thank you for reaching out! We'll get back to you soon.</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="Form-input">
          <label htmlFor="name">My name is </label> &nbsp;
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Name"
          />
        </div>

        <div className="Form-input">
          <label htmlFor="name">Here is my email </label> &nbsp;
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="email"
          />
        </div>

        <div className="textarea-input">
          <label htmlFor="name">And my Message </label> &nbsp;
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="message"
          />
        </div>
        <button
          type="submit"
          style={{ width: "fit-content" }}
          className="cta-button"
        >
          Get Started
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
