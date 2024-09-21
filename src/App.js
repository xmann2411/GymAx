import React from "react";
// import { BrowserRouter as Routes, Route, Router } from "react-router-dom";
import "./index.css";
import backgroundImage from "./Images/aImageTwo.jpg";
import logo from "./Images/JaninLogoBijeli.png";
import offerOne from "./Images/TourOurGym.jpg";
import offerTwo from "./Images/GroupClasses.jpg";
import offerThree from "./Images/AskAboutPersonalTrainer.jpg";
import ownerImage from "./Images/OwnerImage.JPG";
import contactBackground from "./Images/ContactBackgroundTwo.jpg";
import { Link } from "react-router-dom";
// import LogInPage from "./pages/LogInPage"; // Import your pages
// import AdminPage from "./pages/AdminPage";
// import LogedInUser from "./pages/LogedInUser";
// import UserProfilePage from "./pages/UserProfilePage";
// import PaymentPage from "./pages/PaymentPage";

export default function App() {
  return (
    <div className="App">
      <HomePage />
      <SecondPartOfHomePage />
      <AboutUsHomePage />
      <ContactPage />
      {/* <Router> */}
      {/* <Route
          path="/"
          element={
            <div className="App">
              <HomePage />
              <SecondPartOfHomePage />
              <AboutUsHomePage />
              <ContactPage />
            </div>
          }
        />
        <Route path="/logIn/" element={<LogInPage />} />
        <Route path="/adminPage" element={<AdminPage />} />
        <Route path="/userLogedIn/:userId" element={<LogedInUser />} />
        <Route path="/userProfilePage/:userId" element={<UserProfilePage />} />
        <Route path="/paymentPage/:userId" element={<PaymentPage />} /> */}
      {/* </Router> */}
    </div>
  );
}

function HomePage() {
  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="title">
        Welcome to Our <span className="highlight">Website</span>
      </h1>
      <div className="buttons">
        <Link to="/signIn">
          <button className="signInButton">Join today</button>
        </Link>
        <Link to="/logIn">
          <button className="logInButton">I have acc</button>
        </Link>
      </div>
    </div>
  );
}

function SecondPartOfHomePage() {
  return (
    <div className="second-part">
      <h2>What We Offer</h2>
      <h3>We're committed to bringing you the best workout experience</h3>
      <div className="offer-images">
        <div class="offer-container">
          <img
            src={offerOne}
            alt="Offer 1"
            style={{
              width: "75%",
              height: "650px",
            }}
          />
          <h4>Tour Our Gym</h4>
        </div>
        <div class="offer-container">
          <img
            src={offerTwo}
            alt="Offer 2"
            style={{ width: "75%", height: "650px" }}
          />
          <h4>Check out our group classes</h4>
        </div>
        <div class="offer-container">
          <img
            src={offerThree}
            alt="Offer 3"
            style={{ width: "75%", height: "650px" }}
          />
          <h4>Ask about personal training</h4>
        </div>
      </div>
    </div>
  );
}

function AboutUsHomePage() {
  return (
    <div className="third-part">
      <div className="text-content">
        <h2>About our fit family</h2>
        <p>
          Gym Ax was founded in 2024 by a software developer student, Karla
          Axmann. Since then, she has been trying to get her batcheloors degree.
          This project is her last step to accoplishing her goal!
        </p>
        <p className="link">Learn more</p>
      </div>
      <div className="owner-picture">
        <img
          src={ownerImage}
          alt="Owner"
          style={{ width: "60%", height: "700px" }}
        />
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div
      className="fourt-part"
      style={{ backgroundImage: `url(${contactBackground})` }}
    >
      <div className="contact-title">
        <h2>Get in touch today</h2>
      </div>
      <footer className="footer">
        <div className="footer-column">
          <h3 className="info-title">Our Adress</h3>
          <p className="info-text">123 Street, City, Country</p>
        </div>
        <div className="footer-column">
          <h3 className="info-title">Email Address</h3>
          <p className="info-text">gymax@algebra.hr</p>
        </div>
        <div className="footer-column">
          <h3 className="info-title">Phone number</h3>
          <p className="info-text">+123 456 789</p>
        </div>
      </footer>
    </div>
  );
}

//export default App;
