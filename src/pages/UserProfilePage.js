import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./UserProfilePage.css";

export default function UserProfilePage() {
  const { userId } = useParams(); // Get userId from URL params
  const location = useLocation();
  const user = location.state?.user; // Access the user data from state

  const [lastPayment, setLastPayment] = useState({
    paydatetime: "",
    paymodelduration: "",
  });
  const [isSubscriptionValid, setIsSubscriptionValid] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Proveri da li je datum validan

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}.`;
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/paylogs/ispayed/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setLastPayment({
          paydatetime: data.PayDateTime, // Pristupate PayDateTime direktno iz glavnog objekta
          paymodelduration: data.paymodel?.DurationDays, // Pristupate DurationDays unutar paymodel objekta
        });
      })
      .catch((error) => console.error("Error fetching payment data:", error));
  }, [userId]);

  useEffect(() => {
    if (lastPayment.paydatetime && lastPayment.paymodelduration) {
      const today = new Date();
      const paymentDate = new Date(lastPayment.paydatetime);
      const expirationDate = new Date(paymentDate);
      expirationDate.setDate(
        paymentDate.getDate() + lastPayment.paymodelduration
      );

      setIsSubscriptionValid(today <= expirationDate);
    }
  }, [lastPayment]);

  if (!user) {
    return <p>User data not available. Please try logging in again.</p>;
  }

  return (
    <div className="profile-container">
      <h1>My profile</h1>
      <div className="profile-info">
        <p>
          <span className="bold">Name: </span> {user.name}
        </p>
        <p>
          <span className="bold">Surname: </span> {user.lastname}
        </p>
        <p>
          <span className="bold">Date of Birth: </span>
          {formatDate(user.dateOfBirth)}
        </p>

        <p className="is-subscription-valid">
          <span className="bold">Subscription is: </span>{" "}
          {isSubscriptionValid !== null
            ? isSubscriptionValid
              ? "VALID"
              : "INVALID"
            : "Loading..."}
        </p>
        <p>
          <span className="bold">Datum isteka članarine: </span>{" "}
          {formatDate(lastPayment.paydatetime)}
        </p>
      </div>
    </div>
  );
}
