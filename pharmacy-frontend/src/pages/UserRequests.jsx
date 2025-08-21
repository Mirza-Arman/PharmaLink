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
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [selectedResponseByRequest, setSelectedResponseByRequest] = useState({});

  useEffect(() => {
    if (!customer || !customer._id) {
      setError("Not logged in as customer.");
      setLoading(false);
      return;
    }

    // Debug: Check all bills in database
    fetch("http://localhost:5000/api/customer/debug/bills", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('customer_token')}`
      }
    })
    .then(res => res.json())
    .then(debugData => {
      console.log('Debug - All bills in database:', debugData);
    })
    .catch(err => {
      console.error('Debug endpoint error:', err);
    });

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
      console.log('Fetched requests:', requestsData);
      console.log('Fetched bills:', billsData);
      setRequests(requestsData);
      setBills(billsData);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setError("Failed to load data.");
      setLoading(false);
    });
  }, [customer]);

  const handleViewResponse = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const handleSelectResponse = (requestId, response) => {
    setSelectedResponseByRequest(prev => ({ ...prev, [requestId]: response }));
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

  const getResponseCount = (request) => {
    // Count bills for this specific request
    const requestBills = bills.filter(bill => {
      // Handle both string and ObjectId comparisons
      const billRequestId = typeof bill.request === 'string' ? bill.request : bill.request._id;
      const requestId = typeof request._id === 'string' ? request._id : request._id.toString();
      return billRequestId === requestId;
    });
    console.log(`Request ${request._id}: Found ${requestBills.length} bills`);
    return requestBills.length;
  };

  const getRequestStatus = (request) => {
    const responseCount = getResponseCount(request);
    if (responseCount === 0) return 'pending';
    if (responseCount > 0) return 'responded';
    return 'pending';
  };

  // Get actual pharmacy responses (bills) for a specific request
  const getPharmacyResponses = (request) => {
    const requestBills = bills.filter(bill => {
      // Handle both string and ObjectId comparisons
      const billRequestId = typeof bill.request === 'string' ? bill.request : bill.request._id;
      const requestId = typeof request._id === 'string' ? request._id : request._id.toString();
      return billRequestId === requestId;
    });
    console.log(`Getting pharmacy responses for request ${request._id}:`, requestBills);
    
    return requestBills.map(bill => ({
      pharmacyId: bill.pharmacy._id,
      pharmacyName: bill.pharmacy.pharmacyName,
      pharmacy: bill.pharmacy, // Include full pharmacy object for address and phone
      status: bill.status,
      price: bill.totalAmount,
      deliveryCharges: bill.deliveryCharges,
      deliveryTime: bill.deliveryTime,
      medicines: bill.medicines,
      billId: bill._id,
      createdAt: bill.createdAt
    }));
  };

  const handleAcceptOffer = async (billId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/customer/accept-bill/${billId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('customer_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Bill accepted successfully:', data);
        
        // Refresh the data to show updated status
        window.location.reload();
        alert('Offer accepted successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to accept offer');
      }
    } catch (err) {
      console.error('Error accepting offer:', err);
      alert('Error accepting offer. Please try again.');
    }
  };

  const handleContactPharmacy = (pharmacyPhone) => {
    if (pharmacyPhone && pharmacyPhone !== 'N/A') {
      window.open(`tel:${pharmacyPhone}`, '_self');
    } else {
      alert('Phone number not available for this pharmacy.');
    }
  };

  const formatCurrency = (num) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', currencyDisplay: 'code', minimumFractionDigits: 2 }).format(Number(num || 0));

  return (
    <div className="buy-medicine-bg">
      <Header />
      <div className="buy-medicine-inner form-visible">
        <h2 className="buy-medicine-title">My Requests</h2>
        
        {loading && <div className="loading-msg">Loading your requests...</div>}
        {error && <div className="error-msg">{error}</div>}
        
        {!loading && !error && requests.length === 0 && (
          <div className="no-requests">
            <p>No requests found.</p>
            <p>Start by ordering medicines from the Buy Medicine page.</p>
          </div>
        )}
        
        {!loading && !error && requests.length > 0 && (
          <div className="user-requests-container">
            {requests.map((req, idx) => {
              const isExpanded = expandedRequest === req._id;
              const pharmacyResponses = getPharmacyResponses(req);
              const responseCount = pharmacyResponses.length;
              const requestStatus = responseCount > 0 ? 'responded' : 'pending';

              // Determine selected response for this request (default to first)
              const selectedResponse = selectedResponseByRequest[req._id] || pharmacyResponses[0];
              
              return (
                <div 
                  key={req._id || idx} 
                  className={`user-request-card ${isExpanded ? 'expanded' : ''}`}
                >
                  <div className="request-main-content">
                    {/* Left Side - Conditional: default details OR pharmacies list when expanded */}
                    <div className="request-left-side">
                      {!isExpanded ? (
                        <>
                          <div className="request-header">
                            <h3>Request #{req._id.slice(-6)}</h3>
                            <span className="request-date">
                              {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="pharmacy-list-section">
                            <h4>Pharmacies Requested</h4>
                            <div className="pharmacy-list">
                              {req.selectedPharmacies && req.selectedPharmacies.length > 0 ? (
                                req.selectedPharmacies.map((pharmacyId, index) => (
                                  <div key={index} className="pharmacy-item">
                                    <span className="pharmacy-name">
                                      Pharmacy {index + 1}
                                    </span>
                                    <span className="pharmacy-id">ID: {pharmacyId.slice(-6)}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="no-pharmacies">
                                  No pharmacies selected
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="medicine-summary">
                            <h4>Medicine Summary</h4>
                            <div className="medicine-count">
                              {req.medicines.length} medicine(s) requested
                            </div>
                            <div className="medicine-preview">
                              {req.medicines.slice(0, 3).map((med, index) => (
                                <span key={index} className="medicine-tag">
                                  {med.name}
                                </span>
                              ))}
                              {req.medicines.length > 3 && (
                                <span className="medicine-tag more">
                                  +{req.medicines.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="responses-left-list">
                          {pharmacyResponses.map((response, index) => {
                            const isSelected = selectedResponse && response.billId === selectedResponse.billId;
                            return (
                              <div 
                                key={index} 
                                className={`pharmacy-list-item ${isSelected ? 'selected' : ''}`}
                              >
                                <div className="pharmacy-list-item-main">
                                  <div className="pharmacy-list-name">{response.pharmacyName}</div>
                                  <div className="pharmacy-list-meta">{response.pharmacy?.address || 'N/A'}</div>
                                  <div className="pharmacy-list-meta">{response.pharmacy?.phone || 'N/A'}</div>
                                </div>
                                <button 
                                  className="view-response-btn small"
                                  onClick={() => handleSelectResponse(req._id, response)}
                                >
                                  View
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Right Side - Conditional: status panel OR read-only bill form when expanded */}
                    <div className="request-right-side">
                      {!isExpanded ? (
                        <div className="response-status">
                          <div className="status-indicator">
                            <span 
                              className="status-dot"
                              style={{ backgroundColor: getStatusColor(requestStatus) }}
                            ></span>
                            <span className="status-text">
                              {requestStatus === 'responded' ? 'Responses Received' : 'Pending Responses'}
                            </span>
                          </div>
                          
                          <div className="response-count">
                            <span className="count-number">{responseCount}</span>
                            <span className="count-label">pharmacy responses</span>
                          </div>
                          
                          <div className="response-actions">
                            <button 
                              className="view-response-btn"
                              onClick={() => {
                                handleViewResponse(req._id);
                                if (!selectedResponseByRequest[req._id] && pharmacyResponses[0]) {
                                  handleSelectResponse(req._id, pharmacyResponses[0]);
                                }
                              }}
                              disabled={responseCount === 0}
                            >
                              {isExpanded ? 'Hide Responses' : 'View Responses'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="responses-right-form">
                          {selectedResponse ? (
                            <div className="bill-details-form">
                              <h4 className="form-title">Response Details</h4>

                              <div className="form-row">
                                <label>Pharmacy</label>
                                <input type="text" value={selectedResponse.pharmacyName} readOnly />
                              </div>

                              <div className="form-row grid-2">
                                <div>
                                  <label>Medicine Cost</label>
                                  <input type="text" value={formatCurrency(selectedResponse.price - (selectedResponse.deliveryCharges || 0))} readOnly />
                                </div>
                                <div>
                                  <label>Delivery Cost</label>
                                  <input type="text" value={formatCurrency(selectedResponse.deliveryCharges || 0)} readOnly />
                                </div>
                              </div>

                              <div className="form-row">
                                <label>Total Cost</label>
                                <input type="text" value={formatCurrency(selectedResponse.price)} readOnly />
                              </div>

                              <div className="form-row">
                                <label>Delivery Time</label>
                                <input type="text" value={selectedResponse.deliveryTime} readOnly />
                              </div>

                              <div className="form-row">
                                <label>Medicines</label>
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
                                      {selectedResponse.medicines.map((med, medIndex) => (
                                        <tr key={medIndex}>
                                          <td>{med.name}</td>
                                          <td>{med.type || '-'}</td>
                                          <td>{med.strength || '-'}</td>
                                          <td>{med.quantity}</td>
                                          <td>{formatCurrency(med.pricePerUnit)}</td>
                                          <td>{formatCurrency(med.totalPrice)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              <div className="pharmacy-response-actions">
                                <button 
                                  className="action-btn accept-response-btn"
                                  onClick={() => handleAcceptOffer(selectedResponse.billId)}
                                >
                                  Accept Offer
                                </button>
                                <button 
                                  className="action-btn contact-pharmacy-btn"
                                  onClick={() => handleContactPharmacy(selectedResponse.pharmacy?.phone)}
                                >
                                  Contact Pharmacy
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="no-selection">Select a pharmacy on the left to view details</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Removed bottom expanded section to keep form on the right when expanded */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRequests;


