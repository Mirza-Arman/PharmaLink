import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import Header from "../component/Header";
import "./BuyMedicine.css";

const PharmacyDashboard = () => {
  const { pharmacy } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pharmacy || !pharmacy._id) {
      setError("Not logged in as pharmacy.");
      setLoading(false);
      return;
    }
    fetch("http://localhost:5000/api/pharmacy/requests")
      .then(res => res.json())
      .then(data => {
        // Filter requests where this pharmacy is selected
        const filtered = data.filter(req =>
          req.selectedPharmacies && req.selectedPharmacies.includes(pharmacy._id)
        );
        setRequests(filtered);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load requests.");
        setLoading(false);
      });
  }, [pharmacy]);

  return (
    <div className="buy-medicine-bg">
      <Header />
      <div className="buy-medicine-inner form-visible">
          <h2 className="buy-medicine-title">Pharmacy Dashboard</h2>
          {loading && <div>Loading requests...</div>}
          {error && <div className="error-msg">{error}</div>}
          {!loading && !error && requests.length === 0 && (
            <div>No requests for your pharmacy yet.</div>
          )}
          {!loading && requests.length > 0 && (
            <div>
              {requests.map((req, idx) => (
                <div className="pharmacy-card" key={req._id || idx} style={{ display: 'flex', flexDirection: 'row', gap: 24, marginBottom: 24 }}>
                  {/* Left column: Customer data */}
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div><b>Customer:</b> {req.customer?.name || "N/A"}</div>
                    <div><b>City:</b> {req.city}</div>
                    <div><b>Address:</b> {req.address}</div>
                    <div><b>Phone:</b> {req.phone}</div>
                  </div>
                  {/* Right column: Medicine list */}
                  <div style={{ flex: 2 }}>
                    <b>Medicines:</b>
                    <table style={{ width: '100%', marginTop: 6, borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Name</th>
                          <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Type</th>
                          <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Strength/Dosage</th>
                          <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {req.medicines.map((med, i) => (
                          <tr key={i}>
                            <td>{med.name}</td>
                            <td>{med.type || '-'}</td>
                            <td>{med.strength || '-'}</td>
                            <td>{med.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default PharmacyDashboard; 