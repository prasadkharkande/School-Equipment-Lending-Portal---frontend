import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import EquipmentList from './pages/EquipmentList';
import Borrowed from './pages/Borrowed';
import Requests from './pages/Requests';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const role = user?.role; // safely read role

  console.log("App.js - user:", user);

  return (
    <Router>
      {user && <Navbar role={role} />}

      <Routes>
        {/* Public route */}
        
        <Route path='/' element={<Login />} />

        {/* Show the following routes only for student and staff member*/}
        {role === 'student' || role === 'staff' ? (
          <>
            <Route path='/equipment' element={<ProtectedRoute><EquipmentList /></ProtectedRoute>} />
            <Route path='/borrowed' element={<ProtectedRoute><Borrowed /></ProtectedRoute>} />
            <Route path='/requests' element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          </>
        ) : null}

        {/* Show only for admins */}
        {role === 'admin' && (
          <>
          <Route path='/admin' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path='/equipment' element={<ProtectedRoute><EquipmentList /></ProtectedRoute>} />
          <Route path='/borrowed' element={<ProtectedRoute><Borrowed /></ProtectedRoute>} />
          </>
        )}

        {/* Optionally, fallback route */}
        <Route path='*' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
