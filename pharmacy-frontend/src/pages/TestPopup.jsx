import React, { useState } from "react";
import "./BuyMedicine.css";

const TestPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  const testRequest = {
    _id: "test123",
    customerName: "Test Customer",
    phone: "1234567890",
    city: "Test City",
    address: "Test Address",
    createdAt: new Date(),
    medicines: [
      { name: "Paracetamol", type: "Tablet", strength: "500mg", quantity: 10 },
      { name: "Ibuprofen", type: "Tablet", strength: "400mg", quantity: 5 }
    ]
  };

  return (
    <div className="buy-medicine-bg">
      <div className="buy-medicine-inner form-visible">
        <h2 className="buy-medicine-title">Test Popup</h2>
        <button 
          onClick={() => setShowPopup(true)}
          style={{ 
            background: '#2ca7a0', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Test Medicine List Popup
        </button>
      </div>

      {/* Test Medicine List Popup */}
      {showPopup && (
        <div className="medicine-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="medicine-popup" onClick={(e) => e.stopPropagation()}>
            <div className="medicine-popup-header">
              <h3>Test Medicine List</h3>
              <button className="close-popup-btn" onClick={() => setShowPopup(false)}>×</button>
            </div>
            
            <div className="medicine-popup-content">
              <div className="customer-info-section">
                <h4>Customer Information</h4>
                <div className="customer-details">
                  <p><strong>Name:</strong> {testRequest.customerName}</p>
                  <p><strong>Phone:</strong> {testRequest.phone}</p>
                  <p><strong>City:</strong> {testRequest.city}</p>
                  <p><strong>Address:</strong> {testRequest.address}</p>
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
                      {testRequest.medicines.map((med, i) => (
                        <tr key={i}>
                          <td>{med.name}</td>
                          <td>{med.type}</td>
                          <td>{med.strength}</td>
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
                <button className="action-btn close-btn" onClick={() => setShowPopup(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPopup;
