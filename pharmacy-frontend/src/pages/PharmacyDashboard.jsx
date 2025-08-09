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
            <div className="pharmacy-grid">
              {requests.map((req, idx) => (
                <div className="pharmacy-card" key={req._id || idx}>
                  <div><b>Customer:</b> {req.customer?.email || "N/A"}</div>
                  <div><b>City:</b> {req.city}</div>
                  <div><b>Address:</b> {req.address}</div>
                  <div><b>Phone:</b> {req.phone}</div>
                  <div><b>Medicines:</b>
                    <ul style={{margin:0,paddingLeft:18}}>
                      {req.medicines.map((med, i) => (
                        <li key={i}>{med.name} (x{med.quantity})</li>
                      ))}
                    </ul>
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