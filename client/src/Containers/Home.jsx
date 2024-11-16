import coding from '../assets/coding.png'
import realtime from '../assets/real-time.png'
import videoChat from '../assets/video-call.png'
import settings from '../assets/settings.png'
const Home = () => {
  return (
    <div className="home-container">
      <div className="create-meet-container">
        <div className="heading-container">
          <div className="heading">Real-Time Coding Classes for Everyone</div>
          <p className="subheading">
            Create, teach, and collaborate with your students in an interactive coding environment.
          </p>
          <div className="create-input">
            <div className="create-button">Create a Class</div> &nbsp; &nbsp;
            <input type="text" placeholder="Enter code to join" />
          </div>
        </div>
      </div>
      <div className="create-meet-image">
        <div className="feature-content">
          <div className="feature-title">What We Offer<div className="feature-title-desc">Explore the key features that make teaching and learning code easier, faster, and more interactive.</div></div>
          <div className="feature-box">
            <div className="feature-info"> <img className='feature-image' src={coding} /> <br />Interactive Code Editor<div className="feature-desc">Enable students to write and execute code instantly in a collaborative coding environment.</div></div>
            <div className="feature-info"> <img className='feature-image' src={realtime} /> <br />Real-Time Collaboration<div className="feature-desc">Teachers and students can code and communicate in real time, enhancing the learning experience.</div></div>
            <div className="feature-info"> <img className='feature-image' src={settings} /> <br />Customizable Class Setup<div className="feature-desc">Easily set up coding sessions with personalized class settings and project templates.</div></div>
            <div className="feature-info"> <img className='feature-image' src={videoChat} /> <br />Video calling and chat<div className="feature-desc">Teachers can monitor progress and provide immediate help to students as they code.

            </div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home