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
  const [showBillForm, setShowBillForm] = useState(false);
  const [billData, setBillData] = useState({
    medicines: [],
    deliveryCharges: 0,
    deliveryTime: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!pharmacy || !pharmacy._id) {
      setError("Not logged in as pharmacy.");
      setLoading(false);
      return;
    }
    fetch("http://localhost:5000/api/pharmacy/requests")
      .then(res => res.json())
      .then(data => {
        console.log('All requests:', data);
        console.log('Pharmacy ID:', pharmacy._id);
        // Filter requests where this pharmacy is selected
        const filtered = data.filter(req =>
          req.selectedPharmacies && req.selectedPharmacies.includes(pharmacy._id)
        );
        console.log('Filtered requests:', filtered);
        setRequests(filtered);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load requests.");
        setLoading(false);
      });
  }, [pharmacy]);

  const handleViewMedicineList = (request) => {
    console.log('Opening medicine list for request:', request);
    setSelectedRequest(request);
    setShowMedicinePopup(true);
  };

  const closeMedicinePopup = () => {
    setShowMedicinePopup(false);
    setSelectedRequest(null);
  };

  const handleAcceptRequest = () => {
    if (!selectedRequest) return;
    
    // Initialize bill data with medicines from request
    const medicinesWithPrices = selectedRequest.medicines.map(med => ({
      ...med,
      pricePerUnit: 0
    }));
    
    setBillData({
      medicines: medicinesWithPrices,
      deliveryCharges: 0,
      deliveryTime: ""
    });
    
    setShowMedicinePopup(false);
    setShowBillForm(true);
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    
    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/pharmacy/reject-request/${selectedRequest._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('pharmacy_token')}`
        }
      });

      if (response.ok) {
        // Update local state
        setRequests(prev => prev.map(req => 
          req._id === selectedRequest._id 
            ? { ...req, status: 'rejected' }
            : req
        ));
        closeMedicinePopup();
        alert('Request rejected successfully');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to reject request');
      }
    } catch (err) {
      alert('Error rejecting request');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePriceChange = (index, value) => {
    const newMedicines = [...billData.medicines];
    newMedicines[index].pricePerUnit = parseFloat(value) || 0;
    newMedicines[index].totalPrice = newMedicines[index].pricePerUnit * newMedicines[index].quantity;
    
    setBillData({
      ...billData,
      medicines: newMedicines
    });
  };

  const calculateSubtotal = () => {
    return billData.medicines.reduce((sum, med) => sum + (med.totalPrice || 0), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + (billData.deliveryCharges || 0);
  };

  const handleSubmitBill = async () => {
    if (!selectedRequest) return;
    
    // Validate form
    if (billData.medicines.some(med => !med.pricePerUnit || med.pricePerUnit <= 0)) {
      alert('Please enter valid prices for all medicines (must be greater than 0)');
      return;
    }
    if (!billData.deliveryTime || !billData.deliveryTime.trim()) {
      alert('Please enter delivery time');
      return;
    }
    if (billData.deliveryCharges < 0) {
      alert('Delivery charges cannot be negative');
      return;
    }

    // Validate medicine data
    const invalidMedicine = billData.medicines.find(med => 
      !med.name || !med.quantity || med.quantity <= 0
    );
    if (invalidMedicine) {
      alert('All medicines must have valid names and quantities');
      return;
    }

    setSubmitting(true);
    try {
      console.log('Submitting bill data:', {
        medicines: billData.medicines,
        deliveryCharges: billData.deliveryCharges,
        deliveryTime: billData.deliveryTime
      });

      const response = await fetch(`http://localhost:5000/api/pharmacy/accept-request/${selectedRequest._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('pharmacy_token')}`
        },
        body: JSON.stringify({
          medicines: billData.medicines,
          deliveryCharges: Number(billData.deliveryCharges) || 0,
          deliveryTime: billData.deliveryTime.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Bill generated successfully:', data);
        
        // Update local state
        setRequests(prev => prev.map(req => 
          req._id === selectedRequest._id 
            ? { ...req, status: 'accepted', bill: data.bill._id }
            : req
        ));
        setShowBillForm(false);
        setSelectedRequest(null);
        setBillData({
          medicines: [],
          deliveryCharges: 0,
          deliveryTime: ""
        });
        alert('Request accepted and bill generated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert(errorData.message || 'Failed to accept request');
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error: Please check your connection and try again');
    } finally {
      setSubmitting(false);
    }
  };

  const closeBillForm = () => {
    setShowBillForm(false);
    setSelectedRequest(null);
    setBillData({
      medicines: [],
      deliveryCharges: 0,
      deliveryTime: ""
    });
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
                      {req.status === 'pending' && (
                        <button 
                          className="view-medicine-btn"
                          onClick={() => handleViewMedicineList(req)}
                          style={{ 
                            background: '#2ca7a0', 
                            color: 'white', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          View Medicine List
                        </button>
                      )}
                      {req.status !== 'pending' && (
                        <span style={{ 
                          color: getStatusColor(req.status), 
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Right column: Basic request info */}
                  <div style={{ flex: 2 }}>
                    <div><b>Request ID:</b> {req._id}</div>
                    <div><b>Date:</b> {new Date(req.createdAt).toLocaleDateString()}</div>
                    <div><b>Total Medicines:</b> {req.medicines.length}</div>
                    <div><b>Status:</b> <span style={{ color: getStatusColor(req.status), fontWeight: 'bold' }}>{req.status}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medicine List Popup */}
        {console.log('Popup state:', { showMedicinePopup, selectedRequest })}
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
                  <button 
                    className="action-btn accept-btn" 
                    onClick={handleAcceptRequest}
                    disabled={submitting}
                  >
                    Accept Request
                  </button>
                  <button 
                    className="action-btn reject-btn" 
                    onClick={handleRejectRequest}
                    disabled={submitting}
                  >
                    Reject Request
                  </button>
                  <button className="action-btn close-btn" onClick={closeMedicinePopup}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bill Generation Form */}
        {showBillForm && selectedRequest && (
          <div className="medicine-popup-overlay" onClick={closeBillForm}>
            <div className="medicine-popup bill-form-popup" onClick={(e) => e.stopPropagation()}>
              <div className="medicine-popup-header">
                <h3>Generate Bill</h3>
                <button className="close-popup-btn" onClick={closeBillForm}>×</button>
              </div>
              
              <div className="medicine-popup-content">
                <div className="customer-info-section">
                  <h4>Customer Information</h4>
                  <div className="customer-details">
                    <p><strong>Name:</strong> {selectedRequest.customerName || selectedRequest.customer?.name || "N/A"}</p>
                    <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                    <p><strong>Address:</strong> {selectedRequest.address}</p>
                  </div>
                </div>

                <div className="bill-form-section">
                  <h4>Medicine Prices</h4>
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
                        {billData.medicines.map((med, i) => (
                          <tr key={i}>
                            <td>{med.name}</td>
                            <td>{med.type || '-'}</td>
                            <td>{med.strength || '-'}</td>
                            <td>{med.quantity}</td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={med.pricePerUnit || ''}
                                onChange={(e) => handlePriceChange(i, e.target.value)}
                                className="price-input"
                                placeholder="0.00"
                              />
                            </td>
                            <td>₹{(med.totalPrice || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="delivery-details">
                    <h4>Delivery Details</h4>
                    <div className="delivery-inputs">
                      <div className="input-group">
                        <label>Delivery Charges (₹):</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={billData.deliveryCharges || ''}
                          onChange={(e) => setBillData({
                            ...billData,
                            deliveryCharges: parseFloat(e.target.value) || 0
                          })}
                          className="delivery-input"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="input-group">
                        <label>Delivery Time:</label>
                        <input
                          type="text"
                          value={billData.deliveryTime}
                          onChange={(e) => setBillData({
                            ...billData,
                            deliveryTime: e.target.value
                          })}
                          className="delivery-input"
                          placeholder="e.g., 2-3 hours, Same day"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bill-summary">
                    <h4>Bill Summary</h4>
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Delivery Charges:</span>
                      <span>₹{(billData.deliveryCharges || 0).toFixed(2)}</span>
                    </div>
                    <div className="summary-row total-row">
                      <span><strong>Total Amount:</strong></span>
                      <span><strong>₹{calculateTotal().toFixed(2)}</strong></span>
                    </div>
                  </div>

                  <div className="popup-actions">
                    <button 
                      className="action-btn accept-btn" 
                      onClick={handleSubmitBill}
                      disabled={submitting}
                    >
                      {submitting ? 'Generating Bill...' : 'Generate Bill'}
                    </button>
                    <button className="action-btn close-btn" onClick={closeBillForm}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default PharmacyDashboard; 