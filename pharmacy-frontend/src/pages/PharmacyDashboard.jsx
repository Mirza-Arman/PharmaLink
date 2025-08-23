import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import Header from "../component/Header";
import "./pharmacyDashboard.css";

const PharmacyDashboard = () => {
  const { pharmacy, isLoading: authLoading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showMedicinePopup, setShowMedicinePopup] = useState(false);
  const [showBillForm, setShowBillForm] = useState(false);
  const [billData, setBillData] = useState({ medicines: [], deliveryCharges: 0, deliveryTime: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showBillDetailsPopup, setShowBillDetailsPopup] = useState(false);
  const [billDetails, setBillDetails] = useState(null);
  const [loadingBillDetails, setLoadingBillDetails] = useState(false);
  // New: Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalRequests: 0,
    billsGenerated: 0,
    confirmed: 0,
    pending: 0,
    ignored: 0
  });
  // New: Pharmacy profile data
  const [pharmacyProfile, setPharmacyProfile] = useState(null);
  // New: Filter state
  const [activeFilter, setActiveFilter] = useState('all');

  // Function to extract city from address
  const extractCityFromAddress = (address) => {
    if (!address) return "-";
    // Simple city extraction - you can enhance this logic
    const addressParts = address.split(',').map(part => part.trim());
    return addressParts[addressParts.length - 1] || address;
  };

  // Function to fetch pharmacy profile
  const fetchPharmacyProfile = async () => {
    if (!pharmacy || !pharmacy._id) return;
    
    try {
      const response = await fetch("http://localhost:5000/api/pharmacy/profile", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('pharmacy_token')}`
        }
      });
      
      if (response.ok) {
        const profileData = await response.json();
        setPharmacyProfile(profileData);
      }
    } catch (err) {
      console.error('Failed to fetch pharmacy profile:', err);
    }
  };

  // Function to filter requests based on active filter
  const getFilteredRequests = () => {
    if (activeFilter === 'all') return requests;
    
    return requests.filter(req => {
      switch (activeFilter) {
        case 'pending':
          return req.status === 'pending';
        case 'billGenerated':
          return req.status === 'accepted';
        case 'orderConfirmed':
          return req.status === 'completed';
        case 'requestIgnored':
          return req.status === 'rejected';
        default:
          return true;
      }
    });
  };

  // Function to get filter count
  const getFilterCount = (filterType) => {
    switch (filterType) {
      case 'all':
        return requests.length;
      case 'pending':
        return requests.filter(req => req.status === 'pending').length;
      case 'billGenerated':
        return requests.filter(req => req.status === 'accepted').length;
      case 'orderConfirmed':
        return requests.filter(req => req.status === 'completed').length;
      case 'requestIgnored':
        return requests.filter(req => req.status === 'rejected').length;
      default:
        return 0;
    }
  };

  useEffect(() => {
    // Wait for auth to initialize before proceeding
    if (authLoading) return;
    
    if (!pharmacy || !pharmacy._id) {
      setError("Not logged in as pharmacy.");
      setLoading(false);
      return;
    }
    
    // Fetch pharmacy profile
    fetchPharmacyProfile();
    
    fetch("http://localhost:5000/api/pharmacy/requests")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(req => req.selectedPharmacies && req.selectedPharmacies.includes(pharmacy._id));
        setRequests(filtered);
        setLoading(false);
        // Calculate dashboard stats
        let totalRequests = filtered.length;
        let billsGenerated = 0, confirmed = 0, pending = 0, ignored = 0;
        filtered.forEach(req => {
          if (req.status === 'accepted') billsGenerated++;
          if (req.status === 'completed') confirmed++;
          if (req.status === 'pending') pending++;
          if (req.status === 'rejected') ignored++;
        });
        setDashboardStats({ totalRequests, billsGenerated, confirmed, pending, ignored });
      })
      .catch(() => {
        setError("Failed to load requests.");
        setLoading(false);
      });
  }, [pharmacy, authLoading]);

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

  const openBillDetails = async (billId) => {
    if (!billId) return;
    setShowBillDetailsPopup(true);
    setLoadingBillDetails(true);
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('pharmacy_token')}` };
      let res = await fetch(`http://localhost:5000/api/pharmacy/bills/${billId}`, { headers });
      if (!res.ok) {
        // Fallback if different route
        res = await fetch(`http://localhost:5000/api/bills/${billId}`, { headers });
      }
      if (res.ok) {
        const data = await res.json();
        setBillDetails(data.bill || data);
      } else {
        setBillDetails(null);
        alert('Failed to load bill details');
      }
    } catch (e) {
      setBillDetails(null);
      alert('Network error while loading bill details');
    } finally {
      setLoadingBillDetails(false);
    }
  };

  const closeBillDetails = () => {
    setShowBillDetailsPopup(false);
    setBillDetails(null);
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
    <div className="pharmacy-dashboard-bg">
      <Header />
      <div className="pharmacy-dashboard-container">
        {/* Left Sidebar */}
        <aside className="pharmacy-dashboard-sidebar">
          <div className="pharmacy-profile-card">
            <div className="pharmacy-avatar-area">
              <div className="pharmacy-avatar-circle">
                {(pharmacyProfile?.pharmacyName || pharmacy?.pharmacyName || "P").charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="pharmacy-profile-info">
              <h3 className="pharmacy-name">{pharmacyProfile?.pharmacyName || pharmacy?.pharmacyName || "Pharmacy"}</h3>
              <div className="pharmacy-meta"><span>Address:</span> {pharmacyProfile?.address || pharmacy?.address || "-"}</div>
              <div className="pharmacy-meta"><span>Phone:</span> {pharmacyProfile?.phone || pharmacy?.phone || "-"}</div>
              <div className="pharmacy-meta"><span>City:</span> {extractCityFromAddress(pharmacyProfile?.address || pharmacy?.address)}</div>
              <div className="pharmacy-meta"><span>Email:</span> {pharmacyProfile?.email || pharmacy?.email || "-"}</div>
              <div className="pharmacy-meta"><span>Licence:</span> {pharmacyProfile?.licence || pharmacy?.licence || "-"}</div>
            </div>
          </div>
          <div className="pharmacy-dashboard-stats">
            <h4>Dashboard Overview</h4>
            <div className="dashboard-stats-list">
              <div className="dashboard-stat-item total-requests">
                <span className="stat-label">Total Requests</span>
                <span className="stat-value">{dashboardStats.totalRequests}</span>
              </div>
              <div className="dashboard-stat-item bills-generated">
                <span className="stat-label">Bills Generated</span>
                <span className="stat-value">{dashboardStats.billsGenerated}</span>
              </div>
              <div className="dashboard-stat-item confirmed">
                <span className="stat-label">Orders Confirmed</span>
                <span className="stat-value">{dashboardStats.confirmed}</span>
              </div>
              <div className="dashboard-stat-item pending">
                <span className="stat-label">Pending</span>
                <span className="stat-value">{dashboardStats.pending}</span>
              </div>
              <div className="dashboard-stat-item ignored">
                <span className="stat-label">Ignored</span>
                <span className="stat-value">{dashboardStats.ignored}</span>
              </div>
            </div>
          </div>
        </aside>
        {/* Right Main Content */}
        <main className="pharmacy-dashboard-main">
          <div className="buy-medicine-inner form-visible">
            <h2 className="buy-medicine-title">Pharmacy Dashboard</h2>
            
            {/* Interactive Filter System */}
            <div className="requests-filter-container">
              <div className="filter-header">
                <h3 className="filter-heading">Filter</h3>
                <div className="filter-summary">
                  <span className="summary-text">
                    Showing {getFilteredRequests().length} of {requests.length} requests
                  </span>
                </div>
              </div>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  <span className="filter-label">Total Requests</span>
                  <span className="filter-count">{getFilterCount('all')}</span>
                </button>
                
                <button 
                  className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('pending')}
                >
                  <span className="filter-label">Pending</span>
                  <span className="filter-count">{getFilterCount('pending')}</span>
                </button>
                
                <button 
                  className={`filter-btn ${activeFilter === 'billGenerated' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('billGenerated')}
                >
                  <span className="filter-label">Bill Generated</span>
                  <span className="filter-count">{getFilterCount('billGenerated')}</span>
                </button>
                
                <button 
                  className={`filter-btn ${activeFilter === 'orderConfirmed' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('orderConfirmed')}
                >
                  <span className="filter-label">Order Confirmed</span>
                  <span className="filter-count">{getFilterCount('orderConfirmed')}</span>
                </button>
                
                <button 
                  className={`filter-btn ${activeFilter === 'requestIgnored' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('requestIgnored')}
                >
                  <span className="filter-label">Request Ignored</span>
                  <span className="filter-count">{getFilterCount('requestIgnored')}</span>
                </button>
              </div>
            </div>

            {authLoading && <div className="loading-msg">Initializing dashboard...</div>}
            {!authLoading && loading && <div className="loading-msg">Loading requests...</div>}
            {!authLoading && error && <div className="error-msg">{error}</div>}
            {!authLoading && !loading && !error && getFilteredRequests().length === 0 && (
              <div className="no-requests-message">
                {activeFilter === 'all' ? 'No requests for your pharmacy yet.' : `No ${activeFilter.replace(/([A-Z])/g, ' $1').toLowerCase()} requests found.`}
              </div>
            )}
            {!authLoading && !loading && getFilteredRequests().length > 0 && (
              <div>
                {getFilteredRequests().map((req, idx) => (
                  <div className="pharmacy-card" key={req._id || idx} style={{ display: 'flex', flexDirection: 'row', gap: 24, marginBottom: 24, position: 'relative', paddingBottom: 48 }}>
                    {/* Left column: Customer data */}
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div><b>Customer:</b> {req.customerName || req.customer?.name || "N/A"}</div>
                      <div><b>City:</b> {req.city}</div>
                      <div><b>Address:</b> {req.address}</div>
                      <div><b>Phone:</b> {req.phone}</div>
                      <div style={{ marginTop: '10px' }}>
                        {req.status === 'pending' && (
                          <button className="view-medicine-btn" onClick={() => handleViewMedicineList(req)} style={{ background: '#2ca7a0', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                            View Medicine List
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Right column: Basic request info */}
                    <div style={{ flex: 2 }}>
                      <div><b>Request ID:</b> {req._id}</div>
                      <div><b>Date:</b> {new Date(req.createdAt).toLocaleDateString()}</div>
                      <div><b>Total Medicines:</b> {req.medicines.length}</div>
                      <div><b>Status:</b> <span style={{ color: getStatusColor(req.status), fontWeight: 'bold' }}>{req.status === 'accepted' ? 'Bill Generated' : req.status}</span></div>
                    </div>

                    {/* Left-bottom View button when bill is generated */}
                    {req.status === 'accepted' && req.bill && (
                      <button onClick={() => openBillDetails(req.bill)} style={{ position: 'absolute', left: 16, bottom: 12, background: '#1976d2', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                        View
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Popups remain unchanged */}
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

          {/* Bill Details Popup */}
          {showBillDetailsPopup && (
            <div className="medicine-popup-overlay" onClick={closeBillDetails}>
              <div className="medicine-popup" onClick={(e) => e.stopPropagation()}>
                <div className="medicine-popup-header">
                  <h3>Bill Details</h3>
                  <button className="close-popup-btn" onClick={closeBillDetails}>×</button>
                </div>
                <div className="medicine-popup-content">
                  {loadingBillDetails && <div>Loading bill details...</div>}
                  {!loadingBillDetails && billDetails && (
                    <>
                      <div className="customer-info-section">
                        <h4>Summary</h4>
                        <div className="customer-details">
                          <p><strong>Delivery Time:</strong> {billDetails.deliveryTime || '-'}</p>
                          <p><strong>Delivery Charges:</strong> ₹{Number(billDetails.deliveryCharges || 0).toFixed(2)}</p>
                          <p><strong>Total Amount:</strong> ₹{Number(billDetails.totalAmount || 0).toFixed(2)}</p>
                          <p><strong>Status:</strong> {billDetails.status === 'accepted' ? 'Bill Generated' : (billDetails.status || '-')}</p>
                        </div>
                      </div>
                      <div className="medicine-list-section">
                        <h4>Medicines</h4>
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
                              {(billDetails.medicines || []).map((med, i) => (
                                <tr key={i}>
                                  <td>{med.name}</td>
                                  <td>{med.type || '-'}</td>
                                  <td>{med.strength || '-'}</td>
                                  <td>{med.quantity}</td>
                                  <td>₹{Number(med.pricePerUnit || 0).toFixed(2)}</td>
                                  <td>₹{Number(med.totalPrice || 0).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                  {!loadingBillDetails && !billDetails && (
                    <div>Bill details not available.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PharmacyDashboard; 