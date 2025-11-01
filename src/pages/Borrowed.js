import React, { useEffect, useState } from 'react';
import API, { normalizeData } from '../api/api';

export default function Borrowed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const load = async () => {
    setLoading(true);
    var res;
    try {
      if(user.role = 'admin'){
        res = await API.get('/borrow/borrowed');
      }else{
        res = await API.get('/borrow');
      }
      const data = normalizeData(res);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const textToBeShownOnUi = user.role = 'admin'? 'Borrowed Items' : 'My Borrowed Items';

  return (
    <div className="app-container">
      <div style={{ height: 8 }} />
      <div className="page">
          <h2>{textToBeShownOnUi}</h2>
        {loading ? <p>Loading...</p> : (
          <>
            {items.length === 0 ? <p>No active borrows or requests.</p> : items.map(r => (
              <div className="list-item" key={r.id || r.ID || JSON.stringify(r)}>
                <div>
                  <div style={{ fontWeight:700 }}>{r.Equipment?.name || r.equipment?.name || `Item #${r.equipment_id}`}</div>
                  <div className="small">{r.userId}</div>
                  <div className="small">Status: {r.status}</div>
                  <div className="small">Request Date: {new Date(r.request_date || r.request_date || r.createdAt).toLocaleDateString()}</div>
                  <div className="small">Return Date : {new Date(r.return_date || r.return_date || r.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
