import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import LogInPage from "./pages/LogInPage";
import SignInPage from "./pages/SignInPage";
import UserLogedInPage from "./pages/LogedInUser";
import AdminPage from "./pages/AdminPage";
import UserProfilePage from "./pages/UserProfilePage";
import PaymentPage from "./pages/PaymentPage";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "logIn",
    element: <LogInPage />,
  },
  {
    path: "signIn",
    element: <SignInPage />,
  },
  {
    path: "userLogedIn/:userId",
    element: <UserLogedInPage />,
  },
  {
    path: "adminPage",
    element: <AdminPage />,
  },
  {
    path: "userProfilePage/:userId",
    element: <UserProfilePage />,
  },
  {
    path: "paymentPage/:userId",
    element: <PaymentPage />,
  },
]);

document.addEventListener("DOMContentLoaded", function () {
  // Select all h2 elements and images
  const h2Elements = document.querySelectorAll("h2");
  const imgElements = document.querySelectorAll("img");

  // Function to check if an element is in the viewport
  function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  // Function to handle animations
  function handleAnimation() {
    h2Elements.forEach((h2) => {
      if (isInViewport(h2)) {
        h2.classList.add("slide-from-bottom");
      }
    });

    imgElements.forEach((img) => {
      if (isInViewport(img)) {
        img.classList.add("fade-in");
      }
    });
  }

  // Initial check when page loads
  handleAnimation();

  // Add scroll event listener to trigger animations on scroll
  window.addEventListener("scroll", function () {
    handleAnimation();
  });
});

//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
