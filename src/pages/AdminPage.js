import React, { useEffect, useState } from "react";
import "./AdminPage.css";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const [picture, setPicture] = useState(""); // definirana nova varijabla koja se koristi u modalu
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    dateOfBirth: "",
    isPaid: false,
    profilePicture: "", // Inicijaliziraj kao null kako bi rukovao slučajevima bez slike
    picture: null,
    id: "",
  });
  const [isEditing, setIsEditing] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // const [lastEntrance, setLastEntrance] = useState("");
  // const [lastCheckOut, setLastCheckOut] = useState("");

  useEffect(() => {
    // Fetch data from the database
    fetch("http://localhost:8080/api/users")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleEditClick = async (index) => {
    setEditingRow(index);
    setFormData(data[index]);
    setIsEditing(true);
    setPicture(await fetchImage(data[index].id));
    console.log(picture);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      lastname: "",
      dateOfBirth: "",
      isPaid: false,
      profilePicture: "",
      pictue: null,
    });
    // ne  editira se nego se adda
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSaveClick = () => {
    const updatedRow = formData;
    console.log(formData);

    if (isEditing) {
      const userId = updatedRow.id; // Assuming `id` is the field name for user ID
      console.log(JSON.stringify(updatedRow));

      fetch(`http://localhost:8080/api/users/${userId}`, {
        // EDITING user s id-om
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRow),
        // body: updatedRow, // Pošalji FormData objekt umjesto JSON-a
      })
        .then((response) => {
          if (response.ok) {
            const newData = [...data];
            newData[editingRow] = formData;
            setData(newData);
            setEditingRow(null);
            setShowModal(false);
          } else {
            console.error("Error updating data:", response.statusText);
          }
        })
        .catch((error) => console.error("Error updating data:", error));
    } else {
      fetch("http://localhost:8080/api/users", {
        // Kroz metodu se ADDA user
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRow),
        //body: formDataObj, // Pošalji FormData objekt umjesto JSON-a
      })
        .then((response) => response.json())
        .then((newUser) => {
          setData([...data, newUser]);
          setShowModal(false);
        })
        .catch((error) => console.error("Error adding data:", error));
    }
  };

  const handleDeleteClick = (index) => {
    const userId = data[index].id; // Assuming `id` is the field name for user ID

    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setData(data.filter((_, i) => i !== index));
          } else {
            // Handle error
            console.error("Error deleting data:", response.statusText);
          }
        })
        .catch((error) => console.error("Error deleting data:", error));
    }
  };

  const handleInputChange = (e) => {
    // event je trigeran changeom in input field
    const { name, value } = e.target; // name je attribut od formData statea a value je current value of the input field
    setFormData((prevFormData) => ({
      // updatea state
      ...prevFormData, // using the spread operator (...) to create a copy of the previous state (prevFormData).
      [name]: value,
    }));
    // mjenjat će name (dio formDatae) koji se trenutno edita while keeping the other properties of formData unchanged.
  };

  // Read profilePictures ????????????????
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // FILE U FILES, NAME PROPERTI TREBA SPREMIT U BAZU
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader.result);
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      picture: file, // Pohrani sam objekt datoteke, a ne base64 string
      // profilePicture: file.name,
    }));
    formData.profilePicture = file.name;
    console.log(formData);
  };

  // format a date string into a standardized ISO date format (YYYY-MM-DD)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Proveri da li je datum validan

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}.`;
  };

  async function fetchImage(id) {
    let imageUrl = "";
    await fetch(`http://localhost:8080/api/users/picture/${id}`, {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        imageUrl = URL.createObjectURL(blob);
      });
    console.log(imageUrl);
    return imageUrl;
  }

  const filteredData = data.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Fetch users data
    fetch("http://localhost:8080/api/users")
      .then((response) => response.json())
      .then(async (usersData) => {
        const usersWithLogs = await Promise.all(
          usersData.map(async (user) => {
            const logsResponse = await fetch(
              `http://localhost:8080/api/loging/userid/${user.id}`
            );
            const logsData = await logsResponse.json();

            // Find the latest "IN" and "OUT" logs
            const latestEntrance = logsData
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

            const latestCheckOut = logsData
              .filter((log) => log.LogType === "OUT")
              .reduce(
                (latest, current) => {
                  return new Date(current.LogDateTime) >
                    new Date(latest.LogDateTime)
                    ? current
                    : latest;
                },
                { LogDateTime: "1970-01-01T00:00:00.000Z" }
              );

            return {
              ...user,
              lastEntrance: latestEntrance.LogDateTime,
              lastCheckOut:
                new Date(latestCheckOut.LogDateTime) >
                new Date(latestEntrance.LogDateTime)
                  ? latestCheckOut.LogDateTime
                  : null,
            };
          })
        );

        setData(usersWithLogs);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Check if the date is valid

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}.${month}.${year}.`;
  };

  return (
    <div className="admin-page">
      <h1>Admin page</h1>

      <input
        type="text"
        placeholder="Search by name or surname..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table>
        <thead>
          <tr>
            <th>NAME</th>
            <th>SURNAME</th>
            <th className="column-date-of-birth">DATE OF BIRTH</th>
            <th>PAYED</th>
            <th>LAST ENTERENCE</th>
            <th>LAST Checkout</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.lastname}</td>
              <td>{formatDate(row.dateOfBirth)}</td>
              <td>
                {row.isPaid ? "true" : "false"}{" "}
                <Link
                  to={{
                    pathname: `/paymentPage/${row.id}`,
                    state: { user: row },
                  }}
                >
                  <button className="btn-add-payment">Add payment</button>
                </Link>
              </td>
              <td>{row.lastEntrance ? formatTime(row.lastEntrance) : ""}</td>
              <td>{row.lastCheckOut ? formatTime(row.lastCheckOut) : ""}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => handleEditClick(index)}
                >
                  EDIT INFO
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteClick(index)}
                >
                  DELETE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="addButton" onClick={handleAddClick}>
        ADD USER
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isEditing ? "Edit User" : "Add User"}</h2>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Lastname:
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                name="dateOfBirth"
                value={formatDate(formData.dateOfBirth)}
                onChange={handleInputChange}
              />
            </label>
            <label className="isPayed-lbl">
              Paid:
              <input
                type="checkbox"
                name="isPaid"
                checked={formData.isPaid}
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    isPaid: e.target.checked,
                  }))
                }
              />
            </label>
            <p></p>
            <label>
              Add profilePicture:
              <input
                type="file"
                name="picture" // identifikaciju podatka u kodu ili prilikom slanja podataka na server.
                onChange={handleFileChange}
              />
            </label>
            {picture && (
              <img
                className="userPicture"
                src={picture}
                alt="Korisnik"
                width="100"
              />
            )}
            <button onClick={handleSaveClick}>SAVE</button>
            <button onClick={() => setShowModal(false)}>CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
