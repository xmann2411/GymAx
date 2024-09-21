import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate if you're using react-router v6+
import "./LogSign.css";
import logo from "../Images/JaninLogoBijeli.png";

export default function LogInPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Use useNavigate if you're using react-router v6+

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/users");
      const users = await response.json();

      const user = users.find(
        (user) => user.name === name && user.password === password
      );

      if (user) {
        if (user.name === "Admin" && password === "adpass") {
          // Redirect to AdminPage
          navigate("/adminPage");
        } else {
          // Pass user ID and additional data through URL and state
          navigate(`/userLogedIn/${user.id}`, { state: { user } });
        }
      } else {
        alert("Invalid Name OR Password! Please try again.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="title-logsign">Log In</h1>
      <div className="login-box">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Name:</label>
            <input
              type="name"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}
