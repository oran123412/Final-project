import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Sandbox.css";

const SandBox = () => {
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchCards();
    fetchBooks();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:3001/api/users");
    setUsers(response.data);
  };

  const fetchCards = async () => {
    const response = await axios.get("http://localhost:3001/api/cards");
    setCards(response.data);
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/books/all");

      setBooks(response.data);
    } catch (error) {
      setBooks([]);
    }
  };
  useEffect(() => {
    axios.get("http://localhost:3001/api/users").then((response) => {
      const sortedUsers = response.data.sort((a, b) => {
        let fullNameA = [a.name.first, a.name.middle, a.name.last]
          .filter(Boolean)
          .join(" ");
        let fullNameB = [b.name.first, b.name.middle, b.name.last]
          .filter(Boolean)
          .join(" ");
        return fullNameA.localeCompare(fullNameB);
      });
      setUsers(sortedUsers);
    });
  }, []);

  const handleUserUpdate = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.patch(
        `http://localhost:3001/api/users/${selectedUser._id}`,
        selectedUser,
        config
      );

      const updatedUsers = users.map((user) =>
        user._id === selectedUser._id ? response.data : user
      );
      setUsers(updatedUsers);

      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {}
  };

  const eraseUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {}
  };

  const toggleIsBusiness = async (userId, isBusiness) => {
    const newStatus = { isBusiness: !isBusiness };
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.patch(
        `http://localhost:3001/api/users/${userId}`,
        newStatus,
        config
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isBusiness: !user.isBusiness } : user
        )
      );
    } catch (error) {}
  };

  const toggleIsAdmin = async (userId, isAdmin) => {
    const newStatus = { isAdmin: !isAdmin };
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.patch(
        `http://localhost:3001/api/users/${userId}`,
        newStatus,
        config
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isAdmin: !user.isAdmin } : user
        )
      );
    } catch (error) {}
  };

  return (
    <div style={{ margin: "10px" }}>
      <h1>Admin Dashboard</h1>
      <h2>Cards</h2>
      <ul>
        {cards.map((card) => (
          <li key={card._id}>
            Card ID: {card._id} - Likes: {card.likes.length}
          </li>
        ))}
      </ul>
      <h2>Books</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Likes</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(books) &&
            books
              .sort((a, b) => b.likes.length - a.likes.length)
              .map((book) => (
                <tr key={book._id}>
                  <td>{book._id}</td>
                  <td>{book.likes.length}</td>
                  <td>{book.amount}</td>
                </tr>
              ))}
        </tbody>
      </table>
      <br />
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {[user.name.first, user.name.middle, user.name.last]
                  .filter(Boolean)
                  .join(" ")}
              </td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin
                  ? "Admin"
                  : user.isBusiness
                  ? "Business"
                  : "Regular"}
              </td>
              <td>
                <button
                  onClick={() => toggleIsBusiness(user._id, user.isBusiness)}
                >
                  {user.isBusiness ? "Set Non-Business" : "Set Business"}
                </button>
                <button onClick={() => toggleIsAdmin(user._id, user.isAdmin)}>
                  {user.isAdmin ? "Remove Admin" : "Make Admin"}
                </button>
                <button onClick={() => eraseUser(user._id)}>Erase</button>
                <button
                  onClick={() => {
                    setSelectedUser({ ...user });
                    setIsModalOpen(true);
                  }}
                >
                  Edit Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h2>Edit User Details</h2>
            <form
              onSubmit={handleUserUpdate}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <h3 style={{ textAlign: "center" }}>Edit User Details</h3>

              <label>First Name:</label>
              <input
                type="text"
                value={selectedUser.name.first}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    name: { ...selectedUser.name, first: e.target.value },
                  })
                }
                style={{ padding: "8px" }}
              />

              <label>Middle Name:</label>
              <input
                type="text"
                value={selectedUser.name.middle || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    name: { ...selectedUser.name, middle: e.target.value },
                  })
                }
                style={{ padding: "8px" }}
              />

              <label>Last Name:</label>
              <input
                type="text"
                value={selectedUser.name.last}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    name: { ...selectedUser.name, last: e.target.value },
                  })
                }
                style={{ padding: "8px" }}
              />

              <label>Email:</label>
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    email: e.target.value,
                  })
                }
                style={{ padding: "8px" }}
              />

              <label>Phone:</label>
              <input
                type="text"
                value={selectedUser.phone}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    phone: e.target.value,
                  })
                }
                style={{ padding: "8px" }}
              />

              <label>Password:</label>
              <input
                type="password"
                placeholder="New password (optional)"
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    password: e.target.value,
                  })
                }
                style={{ padding: "8px" }}
              />

              <h4 style={{ textAlign: "center" }}>Address</h4>

              <label>Country:</label>
              <input
                type="text"
                value={selectedUser.address.country}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    address: {
                      ...selectedUser.address,
                      country: e.target.value,
                    },
                  })
                }
                style={{ padding: "8px" }}
              />

              <label>State/Province:</label>
              <input
                type="text"
                value={selectedUser.address.state || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    address: { ...selectedUser.address, state: e.target.value },
                  })
                }
                style={{ padding: "8px" }}
              />

              <label>City:</label>
              <input
                type="text"
                value={selectedUser.address.city}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    address: { ...selectedUser.address, city: e.target.value },
                  })
                }
                style={{ padding: "8px" }}
              />

              <label>Street:</label>
              <input
                type="text"
                value={selectedUser.address.street}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    address: {
                      ...selectedUser.address,
                      street: e.target.value,
                    },
                  })
                }
                style={{ padding: "8px" }}
              />

              <label>House Number:</label>
              <input
                type="text"
                value={selectedUser.address.houseNumber}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    address: {
                      ...selectedUser.address,
                      houseNumber: e.target.value,
                    },
                  })
                }
                style={{ padding: "8px" }}
              />

              <label>Zip Code:</label>
              <input
                type="text"
                value={selectedUser.address.zip}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    address: { ...selectedUser.address, zip: e.target.value },
                  })
                }
                style={{ padding: "8px" }}
              />

              <h4 style={{ textAlign: "center" }}>Image</h4>

              <label>Image URL:</label>
              <input
                type="text"
                value={selectedUser.image.url}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    image: { ...selectedUser.image, url: e.target.value },
                  })
                }
                style={{ padding: "8px" }}
              />

              <label>Image Alt Text:</label>
              <input
                type="text"
                value={selectedUser.image.alt}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    image: { ...selectedUser.image, alt: e.target.value },
                  })
                }
                style={{ padding: "8px" }}
              />

              <button
                type="submit"
                style={{ padding: "10px", alignSelf: "center" }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SandBox;
