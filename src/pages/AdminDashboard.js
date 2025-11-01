import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [equipments, setEquipments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: '', condition: '', quantity: 1 });
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const eqRes = await axios.get('http://localhost:4000/api/equipment', { headers });
    const reqRes = await axios.get('http://localhost:4000/api/borrow/borrowed', { headers });

    // console.log("------equipments : ", eqRes);
    // eqRes = reqRes.data.equipment && Array.length(eqRes.data.equipment) > 0 ?  eqRes.data.equipment : [];
    // console.log("-=-=- reqRes : ", reqRes);

    //before showing on the UI, filter all the borrowed list with status returned
    reqRes.data.requests = reqRes.data.requests.filter(r => r.status !== 'returned');
    reqRes.data.requests = reqRes.data.requests.filter(r => r.status !== 'rejected');

    setEquipments(eqRes.data.equipment);
    setRequests(reqRes.data.requests);
  };

  const addEquipment = async () => {
    await axios.post('http://localhost:4000/api/equipment', newItem, { headers });
    setNewItem({ name: '', category: '', condition: '', quantity: 1, available: 1 });
    fetchData();
  };

  const deleteEquipment = async (id) => {
    await axios.delete(`http://localhost:4000/api/equipment/${id}`, { headers });
    fetchData();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:4000/api/borrow/${id}/status`, { status }, { headers });
    fetchData();
  };

  const markReturned = async (id) => {
    await axios.put(`http://localhost:4000/api/borrow/${id}/return`, {}, { headers });
    fetchData();
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {/* <h3>Add Equipment</h3>
      Name: <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}/>
      Item Category: <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}/>
      Item Condition: <input placeholder="Condition" value={newItem.condition} onChange={e => setNewItem({...newItem, condition: e.target.value})}/>
      Quantity: <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})}/>
      <button onClick={addEquipment}>Add</button> */}

      <h3>Add Equipment</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent full-page reload
          addEquipment();
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: 300 }}
      >
        <label>
          Name:
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
        </label>

        <label>
          Item Category:
          <input
            type="text"
            placeholder="Category"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            required
          />
        </label>

        <label>
          Item Condition:
          <input
            type="text"
            placeholder="Condition"
            value={newItem.condition}
            onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
            required
          />
        </label>

        <label>
          Quantity:
          <input
            type="number"
            placeholder="Quantity"
            min="1"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            required
          />
        </label>

        <button type="submit" className="button">Add Equipment</button>
      </form>


      <h3>Equipments</h3>
      <table>
        <thead><tr><th>Equipment Id</th><th>Name</th><th>Category</th><th>Condition</th><th>Quantity</th><th>Actions</th></tr></thead>
        <tbody>
          {equipments.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td><td>{e.name}</td><td>{e.category}</td><td>{e.condition}</td><td>{e.quantity}</td>
              <td><button onClick={() => deleteEquipment(e.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Borrow Requests</h3>
      <table>
        <thead><tr><th>Equipment ID</th><th>Equipment</th><th>User</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{r.equipment_id}</td>
              <td>{r.Equipment?.name}</td>
              <td>{r.User?.email}</td>
              <td>{r.status}</td>
              <td>
                {r.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(r.id, 'approved')}>Approve</button>
                    <button onClick={() => updateStatus(r.id, 'rejected')}>Reject</button>
                  </>
                )}
                {r.status === 'approved' && (
                  <button onClick={() => markReturned(r.id)}>Mark Returned</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
