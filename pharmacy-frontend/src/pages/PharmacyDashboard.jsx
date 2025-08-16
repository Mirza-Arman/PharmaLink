import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import Header from "../component/Header";
import "./BuyMedicine.css";

const PharmacyDashboard = () => {
  const { pharmacy } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showMedicinePopup, setShowMedicinePopup] = useState(false);

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

  const handleViewMedicineList = (request) => {
    setSelectedRequest(request);
    setShowMedicinePopup(true);
  };

  const closeMedicinePopup = () => {
    setShowMedicinePopup(false);
    setSelectedRequest(null);
  };

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
                    <div><b>Customer:</b> {req.customerName || req.customer?.name || "N/A"}</div>
                    <div><b>City:</b> {req.city}</div>
                    <div><b>Address:</b> {req.address}</div>
                    <div><b>Phone:</b> {req.phone}</div>
                    <div style={{ marginTop: '10px' }}>
                      <button 
                        className="view-medicine-btn"
                        onClick={() => handleViewMedicineList(req)}
                      >
                        View Medicine List
                      </button>
                    </div>
                  </div>
                  {/* Right column: Basic request info */}
                  <div style={{ flex: 2 }}>
                    <div><b>Request ID:</b> {req._id}</div>
                    <div><b>Date:</b> {new Date(req.createdAt).toLocaleDateString()}</div>
                    <div><b>Total Medicines:</b> {req.medicines.length}</div>
                    <div><b>Status:</b> <span style={{ color: '#007bff', fontWeight: 'bold' }}>Pending</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medicine List Popup */}
        {showMedicinePopup && selectedRequest && (
          <div className="medicine-popup-overlay" onClick={closeMedicinePopup}>
            <div className="medicine-popup" onClick={(e) => e.stopPropagation()}>
              <div className="medicine-popup-header">
                <h3>Medicine List</h3>
                <button className="close-popup-btn" onClick={closeMedicinePopup}>×</button>
              </div>
              
              <div className="medicine-popup-content">
                <div className="customer-info-section">
                  <h4>Customer Information</h4>
                  <div className="customer-details">
                    <p><strong>Name:</strong> {selectedRequest.customerName || selectedRequest.customer?.name || "N/A"}</p>
                    <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                    <p><strong>City:</strong> {selectedRequest.city}</p>
                    <p><strong>Address:</strong> {selectedRequest.address}</p>
                    <p><strong>Request Date:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="medicine-list-section">
                  <h4>Requested Medicines</h4>
                  <div className="medicine-table-container">
                    <table className="medicine-popup-table">
                      <thead>
                        <tr>
                          <th>Medicine Name</th>
                          <th>Type</th>
                          <th>Strength/Dosage</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRequest.medicines.map((med, i) => (
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

                <div className="popup-actions">
                  <button className="action-btn accept-btn">Accept Request</button>
                  <button className="action-btn reject-btn">Reject Request</button>
                  <button className="action-btn close-btn" onClick={closeMedicinePopup}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default PharmacyDashboard; 