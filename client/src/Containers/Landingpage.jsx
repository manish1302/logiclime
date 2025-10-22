import React from "react";
import landing from "../assets/landing.png";
import google from "../assets/google.png";
import micro from "../assets/micro.png";
import oracle from "../assets/oracle.png";
import apple from "../assets/apple-logo.png";
import adobe from "../assets/aobe.png";
import nasa from "../assets/nasa.png";
import About from "../assets/about.jpg";
import { useNavigate } from "react-router-dom";
import ContactUs from "../Components/ContactUs";
import { BackgroundBeams } from "../AceComponents/ui/background-beams";
const Landingpage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="landing-container">
        {/* First Section: Split Layout with Heading, Subheading, CTA, and Image */}

        <div className="landing-box">
          <div className="text-section">
            <div className="main-heading">
              Code, <span className="heading-words">Connect</span>,
              Collaborate—Transform Learning in{" "}
              <span className="heading-words">Real-Time</span>
            </div>
            <div className="sub-heading">
              Revolutionize the way students learn to code with a platform that
              fosters deeper engagement, instant problem-solving, and continuous
              growth.
            </div>
            {/* <div className="description">
            We provide solutions that will help you grow and innovate faster
            than ever.
          </div> */}
            <button
              style={{ cursor: "pointer", zIndex: "1", position: "relative" }}
              className="cta-button"
              onClick={() => {
                navigate("/home");
              }}
            >
              Get Started
            </button>
          </div>

          {/* <div className="image-section">
          <img src={landing} alt="Product" className="product-image" />
        </div> */}
        </div>
        {/* Banner Section with Company Names */}
        {/* <div className="banner-section">
        <div className="banner-content">
          <img src={adobe} alt="Company 1" className="company-logo" />
          <img src={nasa} alt="Company 2" className="company-logo" />
          <img src={micro} alt="Company 3" className="company-logo" />
          <img src={oracle} alt="Company 3" className="company-logo" />
          <img
            src={apple}
            alt="Company 3"
            className="company-logo"
            style={{ height: "40px" }}
          />
        </div>
      </div> */}

        {/* Features Section */}
        <div className="features">
          <div className="features-header">
            <div className="f-heading">What sets us apart?</div>
            <div className="f-desc">
              At <span className="">Logic Lime</span> we not only offer a
              service, we also offer love and experience.
            </div>
          </div>
          <div className="features-content">
            <div className="feature-card">
              <h2>
                0{" "}
                <span
                  style={{
                    backgroundColor: "rgba(177, 156, 217, 0.3)",
                    borderRadius: "50%",
                    height: "30px",
                    width: "30px",
                    padding: "2px 10px",
                  }}
                >
                  1
                </span>
              </h2>
              <h3>
                Real-Time Pair <br /> Programming
              </h3>
              <p>
                Collaborate directly in the same code editor, with teachers and
                students coding side by side, solving problems together, and
                sharing solutions instantly.
              </p>
            </div>
            <div className="feature-card">
              <h2>
                0{" "}
                <span
                  style={{
                    backgroundColor: "rgba(177, 156, 217, 0.3)",
                    borderRadius: "50%",
                    height: "30px",
                    width: "30px",
                    padding: "2px 10px",
                  }}
                >
                  2
                </span>
              </h2>
              <h3>Instant Feedback & Corrections</h3>
              <p>
                Teachers can view and edit student code in real time, providing
                immediate feedback and guidance to keep students on track and
                improve their coding skills.
              </p>
            </div>
            <div className="feature-card">
              <h2>
                0{" "}
                <span
                  style={{
                    backgroundColor: "rgba(177, 156, 217, 0.3)",
                    borderRadius: "50%",
                    height: "30px",
                    width: "30px",
                    padding: "2px 10px",
                  }}
                >
                  3
                </span>
              </h2>
              <h3>
                Integrated Chat & <br /> Video Calls
              </h3>
              <p>
                Stay connected through in-app chat and video calls, allowing
                seamless communication for clarifications, discussions, and
                support during coding sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Us section  */}
        <ContactUs />
      </div>
      <BackgroundBeams className="BackgroundBeams" />
    </>
  );
};

export default Landingpage;
