import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';
import toast from 'react-hot-toast';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/allusers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const removeUser = async (email) => {
    try {
      await axios.post('/api/removeuser', { email });
      fetchUsers();
    } catch (error) {
      toast.error('Error Removing User.', error);
    } finally {
      toast.success('User Removed Successfully.');
    }
  };

  return (
    <div className="user-list-container">
      <h1>All User List</h1>
      <div className="user-grid">
        <div className="user-grid-header">
          <div className="grid-item">Name</div>
          <div className="grid-item">Email</div>
          <div className="grid-item">Signup Date</div>
          <div className="grid-item">Actions</div>
        </div>
        {users.map((user) => (
          <div className="user-grid-row" key={user.email}>
            <div className="grid-item">{user.name}</div>
            <div className="grid-item">{user.email}</div>
            <div className="grid-item">{new Date(user.date).toLocaleDateString()}</div>
            <div className="grid-item">
              <button className="remove-button" onClick={() => removeUser(user.email)}>
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;