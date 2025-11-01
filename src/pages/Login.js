import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      const token = res.data.token || res.data?.accessToken || null;
      const user = res.data.user || res.data?.user || null;
      if (!token) { setError('No token returned by server'); return; }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (user?.role === 'admin') 
      {
        navigate('/admin');
        window.location.reload();
      }
      else{
        navigate('/equipment');
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="app-container">
      <div style={{ height: 8 }} />
      <div className="page" style={{ maxWidth: 520, margin: '60px auto', textAlign: 'center' }}>
        <h2>Login</h2>
        <form className="form" onSubmit={handleLogin}>
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <button className="button" type="submit">Login</button>
          {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
          <div style={{ marginTop: 12, fontSize: 13, color: '#555' }}>
            Use <b>student@example.com</b> / <b>password123</b> (or admin/staff)
          </div>
        </form>
      </div>
    </div>
  );
}
