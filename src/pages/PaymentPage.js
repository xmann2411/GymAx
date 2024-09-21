import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./PaymentPage.css";
import { Link } from "react-router-dom";

const PaymentPage = () => {
  const { userId } = useParams(); // Extract userId from the URL
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
  });
  const [lastPayment, setLastPayment] = useState({
    paydatetime: "",
    paymodelduration: "",
  });
  const [isSubscriptionValid, setIsSubscriptionValid] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPaymentData, setNewPaymentData] = useState({
    PayDateTime: "",
    PayAmount: "",
    userId: userId, // Uključujemo userId direktno iz URL-a
    paymodelId: "",
  });

  // Check if data was passed through navigation
  const user = location.state?.user;

  useEffect(() => {
    if (user) {
      // If user data is available, initialize state with it
      setFormData({
        name: user.name,
        lastname: user.lastname,
      });
    } else {
      // Fetch user data if not passed through navigation
      fetch(`http://localhost:8080/api/users/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            name: data.name,
            lastname: data.lastname,
          });
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [user, userId]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Proveri da li je datum validan

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}.`;
  };

  const handleAddPaymentClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentData({ ...newPaymentData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/paylogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPaymentData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Payment added:", data);
        setIsModalOpen(false);
        // Ovdje možete dodati logiku za osvježavanje podataka o plaćanju ili prikazivanje poruke o uspjehu.
      })
      .catch((error) => console.error("Error adding payment:", error));
  };

  return (
    <div className="payment-page">
      <h1>{`${formData.name} ${formData.lastname}`}</h1>

      <table>
        <thead>
          <tr>
            <th>Payment date</th>
            <th>Type of membership</th>
          </tr>
        </thead>
        <tbody>
          {/* Example rows; you can dynamically render rows based on fetched payment data */}
          <tr>
            <td>{formatDate(`${lastPayment.paydatetime}`)}</td>
            <td>{`${lastPayment.paymodelduration}`} day(s)</td>
          </tr>
        </tbody>
      </table>

      <p className="is-subscription-valid">
        Subscription is:{" "}
        {isSubscriptionValid !== null
          ? isSubscriptionValid
            ? "VALID"
            : "INVALID"
          : "Loading..."}
      </p>
      <button className="add-payment-button" onClick={handleAddPaymentClick}>
        ADD PAYMENT
      </button>
      <Link to="/adminPage">
        <button className="back-to-admin-button">BACK TO ADMIN PAGE</button>
      </Link>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>
              &times;
            </span>
            <h2>Add new payment</h2>
            <form onSubmit={handleSubmit}>
              <label className="labela">
                Payment date:
                <input
                  type="date"
                  name="PayDateTime"
                  value={newPaymentData.PayDateTime}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label className="labela">
                Payment amount:
                <input
                  type="number"
                  name="PayAmount"
                  value={newPaymentData.PayAmount}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label className="labela">
                Payment ID model:
                <input
                  type="number"
                  name="paymodelId"
                  value={newPaymentData.paymodelId}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">Save payment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
