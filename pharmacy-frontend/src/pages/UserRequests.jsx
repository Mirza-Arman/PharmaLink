import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import Header from "../component/Header";
import "./BuyMedicine.css";

const UserRequests = () => {
  const { customer } = useAuth();
  const [requests, setRequests] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillPopup, setShowBillPopup] = useState(false);

  useEffect(() => {
    if (!customer || !customer._id) {
      setError("Not logged in as customer.");
      setLoading(false);
      return;
    }

    // Fetch requests and bills
    Promise.all([
      fetch("http://localhost:5000/api/customer/requests", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('customer_token')}`
        }
      }),
      fetch("http://localhost:5000/api/customer/bills", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('customer_token')}`
        }
      })
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([requestsData, billsData]) => {
      setRequests(requestsData);
      setBills(billsData);
      setLoading(false);
    })
    .catch(() => {
      setError("Failed to load data.");
      setLoading(false);
    });
  }, [customer]);

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowBillPopup(true);
  };

  const closeBillPopup = () => {
    setShowBillPopup(false);
    setSelectedBill(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#007bff';
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'completed': return '#6c757d';
      default: return '#007bff';
    }
  };

  return (
    <div className="buy-medicine-bg">
      <Header />
      <div className="buy-medicine-inner form-visible">
        <h2 className="buy-medicine-title">My Requests & Bills</h2>
        
        {loading && <div>Loading...</div>}
        {error && <div className="error-msg">{error}</div>}
        
        {!loading && !error && (
          <>
            {/* Requests Section */}
            <div className="section-container">
              <h3>My Requests</h3>
              {requests.length === 0 ? (
                <div className="no-data">No requests found.</div>
              ) : (
                <div className="requests-grid">
                  {requests.map((req, idx) => (
                    <div className="request-card" key={req._id || idx}>
                      <div className="request-header">
                        <h4>Request #{req._id.slice(-6)}</h4>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(req.status) }}
                        >
                          {req.status}
                        </span>
                      </div>
                      <div className="request-details">
                        <p><strong>Date:</strong> {new Date(req.createdAt).toLocaleDateString()}</p>
                        <p><strong>Medicines:</strong> {req.medicines.length} items</p>
                        <p><strong>City:</strong> {req.city}</p>
                        <p><strong>Address:</strong> {req.address}</p>
                      </div>
                      {req.bill && (
                        <div className="bill-info">
                          <p><strong>Bill Generated:</strong> Yes</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bills Section */}
            <div className="section-container">
              <h3>My Bills</h3>
              {bills.length === 0 ? (
                <div className="no-data">No bills found.</div>
              ) : (
                <div className="bills-grid">
                  {bills.map((bill, idx) => (
                    <div className="bill-card" key={bill._id || idx}>
                      <div className="bill-header">
                        <h4>Bill #{bill._id.slice(-6)}</h4>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(bill.status) }}
                        >
                          {bill.status}
                        </span>
                      </div>
                      <div className="bill-details">
                        <p><strong>Pharmacy:</strong> {bill.pharmacy?.pharmacyName || 'N/A'}</p>
                        <p><strong>Date:</strong> {new Date(bill.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total Amount:</strong> ₹{bill.totalAmount.toFixed(2)}</p>
                        <p><strong>Delivery Time:</strong> {bill.deliveryTime}</p>
                      </div>
                      <button 
                        className="view-bill-btn"
                        onClick={() => handleViewBill(bill)}
                      >
                        View Bill Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Bill Details Popup */}
      {showBillPopup && selectedBill && (
        <div className="medicine-popup-overlay" onClick={closeBillPopup}>
          <div className="medicine-popup bill-details-popup" onClick={(e) => e.stopPropagation()}>
            <div className="medicine-popup-header">
              <h3>Bill Details</h3>
              <button className="close-popup-btn" onClick={closeBillPopup}>×</button>
            </div>
            
            <div className="medicine-popup-content">
              <div className="pharmacy-info-section">
                <h4>Pharmacy Information</h4>
                <div className="pharmacy-details">
                  <p><strong>Name:</strong> {selectedBill.pharmacy?.pharmacyName || 'N/A'}</p>
                  <p><strong>Address:</strong> {selectedBill.pharmacy?.address || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedBill.pharmacy?.phone || 'N/A'}</p>
                  <p><strong>Bill Date:</strong> {new Date(selectedBill.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="medicine-list-section">
                <h4>Medicine Details</h4>
                <div className="medicine-table-container">
                  <table className="medicine-popup-table">
                    <thead>
                      <tr>
                        <th>Medicine Name</th>
                        <th>Type</th>
                        <th>Strength</th>
                        <th>Quantity</th>
                        <th>Price per Unit</th>
                        <th>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBill.medicines.map((med, i) => (
                        <tr key={i}>
                          <td>{med.name}</td>
                          <td>{med.type || '-'}</td>
                          <td>{med.strength || '-'}</td>
                          <td>{med.quantity}</td>
                          <td>₹{med.pricePerUnit.toFixed(2)}</td>
                          <td>₹{med.totalPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bill-summary">
                <h4>Bill Summary</h4>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{selectedBill.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Charges:</span>
                  <span>₹{selectedBill.deliveryCharges.toFixed(2)}</span>
                </div>
                <div className="summary-row total-row">
                  <span><strong>Total Amount:</strong></span>
                  <span><strong>₹{selectedBill.totalAmount.toFixed(2)}</strong></span>
                </div>
                <div className="delivery-info">
                  <p><strong>Delivery Time:</strong> {selectedBill.deliveryTime}</p>
                </div>
              </div>

              <div className="popup-actions">
                <button className="action-btn close-btn" onClick={closeBillPopup}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRequests;


