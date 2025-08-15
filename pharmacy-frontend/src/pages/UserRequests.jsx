import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import { useAuth } from "../AuthContext";

const UserRequests = () => {
  const { customer } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("customer_token");
        const res = await fetch("http://localhost:5000/api/customer/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Failed to load requests");
        }
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="buy-medicine-bg">
      <Header />
      <div className="buy-medicine-container">
        <div className="buy-medicine-inner form-visible">
          <h2 className="buy-medicine-title">Your Requests</h2>
          {loading && <div>Loading...</div>}
          {error && <div className="error-msg">{error}</div>}
          {!loading && !error && requests.length === 0 && (
            <div>You have not submitted any requests yet.</div>
          )}
          {!loading && requests.length > 0 && (
            <div className="form-section">
              <div className="pharmacy-grid">
                {requests.map((req) => (
                  <div key={req._id} className="pharmacy-card">
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>
                      {new Date(req.createdAt).toLocaleString()}
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <b>Customer Name:</b> {req.customerName || "N/A"}
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <b>City:</b> {req.city} | <b>Phone:</b> {req.phone}
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <b>Address:</b> {req.address}
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <b>Selected Pharmacies:</b> {Array.isArray(req.selectedPharmacies) ? req.selectedPharmacies.length : 0}
                    </div>
                    <div>
                      <b>Medicines:</b>
                      <table style={{ width: '100%', marginTop: 6, borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Name</th>
                            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Type</th>
                            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Strength</th>
                            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {req.medicines?.map((m, idx) => (
                            <tr key={idx}>
                              <td>{m.name}</td>
                              <td>{m.type || '-'}</td>
                              <td>{m.strength || '-'}</td>
                              <td>{m.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRequests;


