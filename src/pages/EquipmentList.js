import React, { useEffect, useState } from 'react';
import API, { normalizeData } from '../api/api';

export default function EquipmentList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/equipment');
      const data = normalizeData(res);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRequest = async (equipmentId) => {
    try {
      const today = new Date();
      const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
      await API.post('/borrow', { equipment_id: equipmentId, request_date: today.toISOString(), return_date: tomorrow.toISOString() });
      alert('Borrow request submitted (pending approval).');
      load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  const filtered = items.filter(i => !q || (i.name && i.name.toLowerCase().includes(q.toLowerCase())) || (i.category && i.category.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="app-container">
      <div style={{ height: 8 }} />
      <div className="page">
        <h2>Equipment</h2>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
          <input className="input" placeholder="Search by name or category" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="button" onClick={() => { }}>Search</button>
          <button className="button" onClick={() => { setQ(''); }}>Reset</button>
        </div>

        {loading ? <p>Loading...</p> : (
          <>
            {filtered.length === 0 ? <p>No equipment found.</p> : filtered.map(item => (
              <div className="list-item" key={item.id || item.ID || JSON.stringify(item)}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.name}</div>
                  <div className="small">{item.category} • {item.condition_status || item.condition || 'N/A'}</div>
                </div>
                <div className="row">
                  <div className="small">Available Qty: {item.quantity ?? item.quantity ?? item.quantity ?? 0}</div>
                  {(user?.role === 'student' || user?.role === 'staff') && (
                    <button
                      className="button"
                      style={{ marginLeft: 8 }}
                      onClick={() => handleRequest(item.id || item.ID)}
                    >
                      Request
                    </button>
                   )}
                   {/* <button className="button" style={{ marginLeft: 8 }} onClick={() => handleRequest(item.id || item.ID)}>Request</button> */}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
