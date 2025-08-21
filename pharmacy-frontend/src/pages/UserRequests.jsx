import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../AuthContext";
import Header from "../component/Header";
import "./BuyMedicine.css";

const UserRequests = () => {
  const { customer } = useAuth();
  const [requests, setRequests] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedPharmacyBill, setSelectedPharmacyBill] = useState(null);
  const [showMedicineList, setShowMedicineList] = useState(false);
  const rightColRef = useRef(null);
  const [highlightRight, setHighlightRight] = useState(false);

  useEffect(() => {
    if (!customer || !customer._id) {
      setError("Not logged in as customer.");
      setLoading(false);
      return;
    }
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
    .catch((error) => {
      setError("Failed to load data.");
      setLoading(false);
    });
  }, [customer]);

  const getPharmacyResponses = (request) => {
    return bills.filter(bill => {
      const billRequestId = typeof bill.request === 'string' ? bill.request : bill.request._id;
      const requestId = typeof request._id === 'string' ? request._id : request._id.toString();
      return billRequestId === requestId;
    }).map(bill => ({
      pharmacyId: bill.pharmacy._id,
      pharmacyName: bill.pharmacy.pharmacyName,
      pharmacy: bill.pharmacy,
      status: bill.status,
      price: bill.totalAmount,
      deliveryCharges: bill.deliveryCharges,
      deliveryTime: bill.deliveryTime,
      medicines: bill.medicines,
      billId: bill._id,
      createdAt: bill.createdAt
    }));
  };

  const handleViewPharmacy = (requestId, pharmacyBill) => {
    setSelectedRequestId(requestId);
    setSelectedPharmacyBill(pharmacyBill);
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
        window.location.reload();
        alert('Offer accepted successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to accept offer');
      }
    } catch (err) {
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

  // Helper to scroll right column into view
  const scrollRightColIntoView = () => {
    if (rightColRef.current) {
      rightColRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightRight(true);
      setTimeout(() => setHighlightRight(false), 800);
    }
  };

  return (
    <div className="buy-medicine-bg">
      <Header />
      <div className="buy-medicine-inner form-visible" style={{ display: 'flex', gap: 48, minHeight: 600, maxWidth: '1400px', width: '98vw', transition: 'max-width 0.4s', height: 'auto', overflow: 'hidden' }}>
        {/* Left Column: Requests and Pharmacies */}
        <div style={{ flex: 1.2, minWidth: 380, paddingRight: 10, paddingLeft: 10, maxHeight: '92vh', overflowY: 'auto' }}>
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
            <div className="user-requests-list">
              {requests.map((req, idx) => {
                const pharmacyResponses = getPharmacyResponses(req);
                const isSelectedRequest = selectedRequestId === req._id;
                // For each selected request, show pharmacy names and status only
                return (
                  <div key={req._id || idx} className={`user-request-card${isSelectedRequest ? ' selected' : ''}`} style={{
                    marginBottom: 22,
                    marginLeft: isSelectedRequest ? 4 : 0, // add a small left margin for selected card
                    border: isSelectedRequest ? '2px solid #000' : '1.5px solid #e0e0e0',
                    borderRadius: 10,
                    padding: 16,
                    background: isSelectedRequest ? '#f3fcfa' : '#fff',
                    boxShadow: isSelectedRequest ? '0 6px 24px #b2f0e6' : '0 2px 8px #e0e0e0',
                    transform: isSelectedRequest ? 'scale(1.04)' : 'scale(1)',
                    transition: 'all 0.18s cubic-bezier(.4,1.4,.6,1)'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 4, color: '#2ca7a0', fontSize: 17, cursor: 'pointer' }} onClick={() => { setSelectedRequestId(req._id); setShowMedicineList(false); setSelectedPharmacyBill(null); }}>
                      Request #{req._id.slice(-6)}
                    </div>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{new Date(req.createdAt).toLocaleDateString()}</div>
                    <div style={{ fontSize: 14, marginBottom: 8 }}>Pharmacies:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {(req.selectedPharmacies && req.selectedPharmacies.length > 0) ? (
                        req.selectedPharmacies.map((pharmacyId, pidx) => {
                          // Find if this pharmacy has responded
                          const response = pharmacyResponses.find(bill => bill.pharmacyId === pharmacyId);
                          // Show actual pharmacy name if available
                          const pharmacyName = response ? response.pharmacyName : (req.pharmacyNames && req.pharmacyNames[pidx]) || 'Pharmacy';
                          // Determine if any offer is accepted for this request
                          const acceptedBill = pharmacyResponses.find(bill => bill.status === 'accepted' || bill.status === 'completed');
                          // Determine status text and color
                          let statusText = 'Response Pending';
                          let statusColor = '#ff9800';
                          if (response) {
                            if (acceptedBill) {
                              if (acceptedBill.pharmacyId === pharmacyId) {
                                statusText = 'Order Confirmed';
                                statusColor = '#1976d2';
                              } else {
                                statusText = 'Ignored';
                                statusColor = '#bdbdbd';
                              }
                            } else if (response.status === 'accepted' || response.status === 'completed') {
                              statusText = 'Order Confirmed';
                              statusColor = '#1976d2';
                            } else {
                              statusText = 'Bill Generated';
                              statusColor = '#28a745';
                            }
                          }
                          return (
                            <div key={pharmacyId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafbfc', borderRadius: 6, padding: '6px 12px' }}>
                              <span style={{ fontWeight: 600, color: '#2ca7a0', fontSize: 15 }}>{pharmacyName}</span>
                              <span style={{ color: statusColor, fontSize: 13, fontWeight: 500 }}>
                                {statusText}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ color: '#999', fontSize: 13, marginBottom: 8 }}>No pharmacies selected</div>
                      )}
                    </div>
                    {/* Show button at the bottom */}
                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                      {pharmacyResponses.length > 0 ? (
                        <button
                          className="view-response-btn"
                          style={{ padding: '8px 20px', fontSize: 15, background: '#2ca7a0', color: '#fff', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedRequestId(req._id);
                            setShowMedicineList(false);
                            setSelectedPharmacyBill(pharmacyResponses[0]);
                            scrollRightColIntoView();
                          }}
                        >
                          View Inquiries
                        </button>
                      ) : (
                        <button
                          className="view-response-btn"
                          style={{ padding: '8px 20px', fontSize: 15, background: '#1976d2', color: '#fff', borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedRequestId(req._id);
                            setShowMedicineList(true);
                            setSelectedPharmacyBill(null);
                            scrollRightColIntoView();
                          }}
                        >
                          View Medicine List
                        </button>
                      )}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, color: '#888' }}>
                      {pharmacyResponses.length} pharmacy response(s)
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Right Column: Chrome-style Tabs for Pharmacies or Medicine List */}
        <div
          ref={rightColRef}
          style={{
            flex: 2,
            minWidth: 500,
            paddingLeft: 32,
            position: 'relative',
            alignSelf: 'flex-start',
            transition: 'box-shadow 0.3s',
            boxShadow: highlightRight ? '0 0 0 4px #2ca7a0' : 'none',
            background: '#fff',
            zIndex: 2
          }}
        >
          <h2 className="buy-medicine-title">Pharmacy Offer Details</h2>
          {/* Chrome-style tabs for pharmacies */}
          {selectedRequestId && !showMedicineList && getPharmacyResponses(requests.find(r => r._id === selectedRequestId)).length > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, marginBottom: 24, borderBottom: '2.5px solid #e0e0e0', minHeight: 48 }}>
              {getPharmacyResponses(requests.find(r => r._id === selectedRequestId)).map((pharmacyBill, idx) => {
                const isActive = selectedPharmacyBill && selectedPharmacyBill.billId === pharmacyBill.billId;
                return (
                  <div
                    key={pharmacyBill.pharmacyId}
                    onClick={() => setSelectedPharmacyBill(pharmacyBill)}
                    style={{
                      cursor: 'pointer',
                      background: isActive ? '#fff' : '#eaf7f6',
                      color: isActive ? '#2ca7a0' : '#666',
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      border: isActive ? '2.5px solid #2ca7a0' : '2.5px solid #e0e0e0',
                      borderBottom: isActive ? 'none' : '2.5px solid #e0e0e0',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 16,
                      padding: '12px 32px 10px 32px',
                      marginRight: 2,
                      marginBottom: isActive ? '-2.5px' : 0,
                      boxShadow: isActive ? '0 2px 12px #b2f0e6' : 'none',
                      zIndex: isActive ? 2 : 1,
                      transition: 'all 0.22s cubic-bezier(.4,1.4,.6,1)'
                    }}
                  >
                    {pharmacyBill.pharmacyName}
                  </div>
                );
              })}
            </div>
          )}
          {/* Animated offer details below tabs or medicine list */}
          {showMedicineList && selectedRequestId ? (
            <div className="bill-details-form" style={{ background: '#f8fafd', borderRadius: 12, padding: 32, boxShadow: '0 2px 12px #b2f0e6', animation: 'fadeInRow 0.5s', minHeight: 200 }}>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8, color: '#2ca7a0', display: 'flex', alignItems: 'center', gap: 12 }}>
                Medicine List
              </div>
              <div style={{ marginBottom: 18, fontSize: 15 }}>
                <b>Request ID:</b> {selectedRequestId.slice(-6)}
              </div>
              <div className="medicine-table-container" style={{ marginBottom: 18 }}>
                <table className="medicine-popup-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Type</th>
                      <th>Strength</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const req = requests.find(r => r._id === selectedRequestId);
                      return req && req.medicines ? req.medicines.map((med, medIndex) => (
                        <tr key={medIndex}>
                          <td>{med.name}</td>
                          <td>{med.type || '-'}</td>
                          <td>{med.strength || '-'}</td>
                          <td>{med.quantity}</td>
                        </tr>
                      )) : null;
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          ) : !selectedPharmacyBill ? (
            <div style={{ color: '#888', fontSize: 18, marginTop: 48, textAlign: 'center', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Select a request and click a button to view details.</div>
          ) : (
            (() => {
              // Find if any offer is accepted for this request
              const pharmacyResponses = getPharmacyResponses(requests.find(r => r._id === selectedRequestId));
              const acceptedBill = pharmacyResponses.find(bill => bill.status === 'accepted' || bill.status === 'completed');
              const isAccepted = acceptedBill && acceptedBill.billId === selectedPharmacyBill.billId;
              const isIgnored = acceptedBill && acceptedBill.billId !== selectedPharmacyBill.billId;
              return (
                <div className="bill-details-form" style={{ background: '#f8fafd', borderRadius: 12, padding: 32, boxShadow: '0 2px 12px #b2f0e6', animation: 'fadeInRow 0.5s' }}>
                  <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8, color: '#2ca7a0', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>{selectedPharmacyBill.pharmacyName}</span>
                    <span style={{ fontSize: 15, color: '#666', fontWeight: 400 }}>{selectedPharmacyBill.pharmacy?.address || 'N/A'}</span>
                  </div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 12 }}>{selectedPharmacyBill.pharmacy?.phone || 'N/A'}</div>
                  <div style={{ marginBottom: 18, fontSize: 15 }}>
                    <b>Delivery Time:</b> {selectedPharmacyBill.deliveryTime}
                  </div>
                  <div className="medicine-table-container" style={{ marginBottom: 18 }}>
                    <table className="medicine-popup-table" style={{ width: '100%' }}>
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
                        {selectedPharmacyBill.medicines.map((med, medIndex) => (
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
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 40, marginBottom: 18, fontSize: 16 }}>
                    <div><b>Medicine Total:</b> {formatCurrency(selectedPharmacyBill.price - (selectedPharmacyBill.deliveryCharges || 0))}</div>
                    <div><b>Delivery:</b> {formatCurrency(selectedPharmacyBill.deliveryCharges || 0)}</div>
                    <div style={{ fontWeight: 700, color: '#2ca7a0' }}><b>Grand Total:</b> {formatCurrency(selectedPharmacyBill.price)}</div>
                  </div>
                  {/* Status messages and actions */}
                  {isAccepted ? (
                    <div style={{ background: '#e3f7e6', color: '#1976d2', borderRadius: 8, padding: '18px 20px', marginBottom: 12, fontWeight: 600, fontSize: 17, textAlign: 'center', border: '2px solid #1976d2' }}>
                      <span>Order Confirmed! You will get your medicine soon from this pharmacy.</span>
                    </div>
                  ) : isIgnored ? (
                    <div style={{ background: '#f5f5f5', color: '#bdbdbd', borderRadius: 8, padding: '18px 20px', marginBottom: 12, fontWeight: 600, fontSize: 17, textAlign: 'center', border: '2px solid #bdbdbd' }}>
                      <span>This offer was ignored as you accepted another pharmacy's offer.</span>
                    </div>
                  ) : null}
                  {/* Show action buttons only if not ignored or accepted */}
                  {!isAccepted && !isIgnored && (
                    <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                      <button className="action-btn accept-response-btn" style={{ fontSize: 16, padding: '12px 28px' }} onClick={() => handleAcceptOffer(selectedPharmacyBill.billId)}>
                        Accept Offer
                      </button>
                      <button className="action-btn contact-pharmacy-btn" style={{ fontSize: 16, padding: '12px 28px' }} onClick={() => handleContactPharmacy(selectedPharmacyBill.pharmacy?.phone)}>
                        Contact Pharmacy
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRequests;






