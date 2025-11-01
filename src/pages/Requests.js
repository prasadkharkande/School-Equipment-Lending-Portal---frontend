import React, { useEffect, useState } from 'react';
import API, { normalizeData } from '../api/api';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [equipmentId, setEquipmentId] = useState('');
  const [equipments, setEquipments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get(user?.role === 'admin' ? '/borrow/borrowed' : '/borrow');
      const data = normalizeData(res);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally { setLoading(false); }
  };

  const loadEquip = async () => {
    try {
      const res = await API.get('/equipment');
      const data = normalizeData(res);
      setEquipments(Array.isArray(data)?data:[]);
    } catch (err) { setEquipments([]); }
  };

  useEffect(()=>{ load(); loadEquip(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!equipmentId) return alert('Select equipment');
    try {
      const today = new Date();
      const tomorrow = new Date(Date.now()+24*3600*1000);
      await API.post('/borrow', { equipment_id: Number(equipmentId), request_date: today.toISOString(), return_date: tomorrow.toISOString() });
      alert('Request submitted');
      setEquipmentId('');
      load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create request');
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await API.put(`/borrow/${id}/status`, { status: 'approved' });
      else if (action === 'reject') await API.put(`/borrow/${id}/status`, { status: 'rejected' });
      else if (action === 'return') await API.put(`/borrow/${id}/return`);
      load();
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  return (
    <div className="app-container">
      <div style={{ height: 8 }} />
      <div className="page">
        <h2>Requests</h2>

        {user?.role !== 'admin' && (
          <form onSubmit={handleCreate} style={{ marginBottom:12, display:'flex', gap:8, alignItems:'center' }}>
            <select className="input" value={equipmentId} onChange={(e)=>setEquipmentId(e.target.value)}>
              <option value=''>Select equipment to request</option>
              {equipments.map(eq => <option key={eq.id} value={eq.id}>{eq.name} ({eq.category})</option>)}
            </select>
            <button className="button" type="submit">Create Request</button>
          </form>
        )}

        {loading ? <p>Loading...</p> : (
          <>
            {requests.length === 0 ? <p>No requests</p> : requests.map(r => (
              <div className="list-item" key={r.id}>
                <div>
                  <div style={{ fontWeight:700 }}>{r.Equipment?.name || r.equipment?.name || `Item #${r.equipment_id}`}</div>
                  <div className="small">By: {r.User?.name || r.user?.name || `User #${r.user_id}`}</div>
                  <div className="small">Status: {r.status}</div>
                </div>
                <div className="row">
                  {(user?.role === 'admin' || user?.role === 'staff') && r.status === 'pending' && (
                    <>
                      <button className="button" onClick={()=>handleAction(r.id,'approve')}>Approve</button>
                      <button className="button" style={{ background:'#888' }} onClick={()=>handleAction(r.id,'reject')}>Reject</button>
                    </>
                  )}
                  {(user?.role === 'admin' || user?.role === 'staff') && r.status === 'approved' && (
                    <button className="button" style={{ background:'#46a049' }} onClick={()=>handleAction(r.id,'return')}>Mark Returned</button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
