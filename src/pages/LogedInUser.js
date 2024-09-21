import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./LogedInUser.css";

export default function LogedInUser() {
  const { userId } = useParams(); // Extract userId from the URL
  const location = useLocation();
  const user = location.state.user; // Access the user data from state
  const navigate = useNavigate();

  const [lastEntrance, setLastEntrance] = useState("");
  const [lastCheckOut, setLastCheckOut] = useState("");
  const [currentGymCount, setCurrentGymCount] = useState(0); // State to hold the number of people in the gym

  const handleProfileClick = () => {
    navigate(`/userProfilePage/${userId}`, { state: { user } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Proveri da li je datum validan

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}.`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Check if the date is valid

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    // Fetch log data and find the latest "IN" and "OUT" logs
    fetch(`http://localhost:8080/api/loging/userid/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          // Find the latest "IN" log
          const latestEntrance = data
            .filter((log) => log.LogType === "IN")
            .reduce(
              (latest, current) => {
                return new Date(current.LogDateTime) >
                  new Date(latest.LogDateTime)
                  ? current
                  : latest;
              },
              { LogDateTime: "1970-01-01T00:00:00.000Z" }
            );

          // Find the latest "OUT" log
          const latestCheckOut = data
            .filter((log) => log.LogType === "OUT")
            .reduce(
              // metoda se koristi za pronalaženje najnovijeg loga iz filtriranih logova.
              (latest, current) => {
                // latest je akumulator koji čuva trenutni najnoviji log
                // current je trenutni log u iteraciji
                return new Date(current.LogDateTime) >
                  new Date(latest.LogDateTime)
                  ? current
                  : latest;
              },
              { LogDateTime: "1970-01-01T00:00:00.000Z" }
            );

          setLastEntrance(latestEntrance.LogDateTime);
          setLastCheckOut(latestCheckOut.LogDateTime);
        }
      })
      .catch((error) => console.error("Error fetching log data:", error));
  }, [userId]);

  useEffect(() => {
    // Fetch the current number of people in the gym
    fetch(`http://localhost:8080/api/loging/ingym`)
      .then((response) => response.json())
      .then((data) => {
        setCurrentGymCount(data.length); // Set the number of records in the state
      })
      .catch((error) =>
        console.error("Error fetching current gym count:", error)
      );
  }, []);

  return (
    <div className="container">
      <div className="left-section">
        <h2>Data about my visits</h2>
        <p>Last session: </p>
        <div className="profile-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Entrance time</th>
                <th>Checkout time</th>
              </tr>
            </thead>
            <tbody>
              <td>{formatDate(lastEntrance)} </td>
              <td>{formatTime(lastEntrance)} h</td>
              <td>
                {new Date(lastCheckOut) > new Date(lastEntrance) &&
                  formatTime(lastCheckOut)}{" "}
                h
              </td>
            </tbody>
          </table>
        </div>
        <div className="visit-info">
          <p>How often I go</p>
          <p>Early bird or late owl?</p>
        </div>
      </div>
      <div className="current-user-num-in">
        TRENUTNI BROJ LJUDI U GYMU:
        <p>{currentGymCount}</p>
      </div>

      {/* <div className="right-section"> */}
      {/* <button>Groups</button> */}
      {/* <button>LIVE</button> */}
      {/* <p>{user.userId}</p>
        <p>{user.name}</p> */}
      <button onClick={handleProfileClick}>My Profile</button>
      {/* </div> */}
    </div>
  );
}
