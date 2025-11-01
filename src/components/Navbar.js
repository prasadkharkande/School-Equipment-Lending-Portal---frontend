import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  // No navbar if user not logged in
  if (!user) return null;

  return (
    <div className="navbar">
      

      {(role === 'student' || role === 'staff') && (
        <>
          <Link to="/equipment">Equipment</Link>
          <Link to="/requests">Requests</Link>
          <Link to="/borrowed">Borrowed</Link>
        </>
      )}

      {role === 'admin' && (
        <>
          <Link to="/admin">Admin Dashboard</Link>
          <Link to="/equipment">Equipment</Link>
          <Link to="/borrowed">Equipment Borrowing History</Link>
        </>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
