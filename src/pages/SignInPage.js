// import React from "react";
// import "./LogSign.css";
// import logo from "../Images/JaninLogoBijeli.png";

// export default function SignInPage() {
//   return (
//     <div className="container">
//       <img src={logo} alt="Logo" className="logo" />
//       <h1 className="title-logsign">Sign In</h1>
//       <div className="login-box">
//         <form>
//           <div className="form-group">
//             <label htmlFor="email">Name:</label>
//             <input type="email" id="email" name="email" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password:</label>
//             <input type="password" id="password" name="password" />
//           </div>
//           <button type="submit">Sign In</button>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import "./LogSign.css";
import logo from "../Images/JaninLogoBijeli.png";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    password: "",
    dateOfBirth: "",
  });

  const [isLoading, setIsLoading] = useState(false); // Optional: for loading state
  const [error, setError] = useState(null); // Optional: for error handling

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create user");
        }
        return response.json();
      })
      .then((newUser) => {
        setIsLoading(false);
        alert("User created successfully!");

        // Optionally, you can redirect the user to another page
        // For example: window.location.href = "/login";
      })
      .catch((error) => {
        setIsLoading(false);
        setError("An error occurred: " + error.message);
      });
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="title-logsign">Sign In</h1>
      <div className="signin-box">
        <form onSubmit={handleSubmit}>
          <div className="form-group-signIn">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group-signIn">
            <label htmlFor="lastname">Last Name:</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group-signIn">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group-signIn">
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating User..." : "Sign Up"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}
