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
  const [billData, setBillData] = useState({ medicines: [], deliveryCharges: 0, deliveryTime: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showBillDetailsPopup, setShowBillDetailsPopup] = useState(false);
  const [billDetails, setBillDetails] = useState(null);
  const [loadingBillDetails, setLoadingBillDetails] = useState(false);
  // New state to track if medicine popup is in bill generation mode
  const [isBillGenerationMode, setIsBillGenerationMode] = useState(false);
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
  // New: Success message state
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Function to extract city from address
  const extractCityFromAddress = (address) => {
    if (!address) return "-";
    // Simple city extraction - you can enhance this logic
    const addressParts = address.split(',').map(part => part.trim());
    return addressParts[addressParts.length - 1] || address;
  };

  // Function to show success message
  const displaySuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage('');
    }, 3000);
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

  // Function to refresh requests data
  const refreshRequestsData = async () => {
    if (!pharmacy || !pharmacy._id) return;
    
    try {
      const response = await fetch("http://localhost:5000/api/pharmacy/requests", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('pharmacy_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Refreshed requests data:', data);
        const filtered = data.filter(req => req.selectedPharmacies && req.selectedPharmacies.includes(pharmacy._id));
        console.log('Refreshed filtered requests:', filtered);
        setRequests(filtered);
        
        // Recalculate dashboard stats
        let totalRequests = filtered.length;
        let billsGenerated = 0, confirmed = 0, pending = 0, ignored = 0;
        filtered.forEach(req => {
          if (req.status === 'accepted') billsGenerated++;
          if (req.status === 'completed') confirmed++;
          if (req.status === 'pending') pending++;
          if (req.status === 'rejected') ignored++;
        });
        setDashboardStats({ totalRequests, billsGenerated, confirmed, pending, ignored });
      } else {
        console.error('Failed to refresh requests data:', response.status);
        // Don't clear existing data on error, just log it
      }
    } catch (err) {
      console.error('Failed to refresh requests data:', err);
      // Don't clear existing data on error, just log it
    }
  };

  // Function to filter requests based on active filter
  const getFilteredRequests = () => {
    if (activeFilter === 'all') return requests;
    
    return requests.filter(req => {
      switch (activeFilter) {
        case 'pending':
          return req.status === 'pending' && (!req.bills || !req.bills.some(bill => bill.pharmacy._id.toString() === pharmacy._id.toString()));
        case 'billGenerated':
          return req.status === 'pending' && req.bills && req.bills.some(bill => bill.pharmacy._id.toString() === pharmacy._id.toString());
        case 'orderConfirmed':
          return req.status === 'accepted' && req.acceptedBy && req.acceptedBy.toString() === pharmacy._id.toString();
        case 'requestIgnored':
          return req.status === 'accepted' && req.acceptedBy && req.acceptedBy.toString() !== pharmacy._id.toString();
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
        return requests.filter(req => req.status === 'pending' && (!req.bills || !req.bills.some(bill => bill.pharmacy._id.toString() === pharmacy._id.toString()))).length;
      case 'billGenerated':
        return requests.filter(req => req.status === 'pending' && req.bills && req.bills.some(bill => bill.pharmacy._id.toString() === pharmacy._id.toString())).length;
      case 'orderConfirmed':
        return requests.filter(req => req.status === 'accepted' && req.acceptedBy && req.acceptedBy.toString() === pharmacy._id.toString()).length;
      case 'requestIgnored':
        return requests.filter(req => req.status === 'accepted' && req.acceptedBy && req.acceptedBy.toString() !== pharmacy._id.toString()).length;
      default:
        return 0;
    }
  };

  // Function to refresh requests and update stats
  const refreshRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pharmacy/requests", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('pharmacy_token')}`
        }
      });
      const data = await response.json();
      // No need to filter since backend now returns only relevant requests
      setRequests(data);
      
      // Recalculate dashboard stats
      let totalRequests = data.length;
      let billsGenerated = 0, confirmed = 0, pending = 0, ignored = 0;
      data.forEach(req => {
        console.log('Processing request:', req._id, 'Status:', req.status, 'Bills:', req.bills);
        if (req.status === 'accepted' && req.acceptedBy && req.acceptedBy.toString() === pharmacy._id.toString()) {
          confirmed++; // Customer accepted this pharmacy's bill
          console.log('Request confirmed by this pharmacy');
        } else if (req.status === 'accepted' && req.acceptedBy && req.acceptedBy.toString() !== pharmacy._id.toString()) {
          ignored++; // Customer accepted another pharmacy's bill
          console.log('Request ignored - accepted by another pharmacy');
        } else if (req.status === 'pending' && req.bills && req.bills.some(bill => bill.pharmacy._id.toString() === pharmacy._id.toString())) {
          billsGenerated++; // This pharmacy has generated a bill but customer hasn't accepted yet
          console.log('Bill generated by this pharmacy');
        } else if (req.status === 'pending') {
          pending++; // Still pending, no bill generated by this pharmacy
          console.log('Request still pending');
        } else if (req.status === 'rejected') {
          ignored++; // Request was rejected
          console.log('Request rejected');
        }
      });
      console.log('Dashboard stats calculated:', { totalRequests, billsGenerated, confirmed, pending, ignored });
      setDashboardStats({ totalRequests, billsGenerated, confirmed, pending, ignored });
    } catch (error) {
      console.error('Error refreshing requests:', error);
      // Don't clear existing data on error, just log it
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
    
    fetch("http://localhost:5000/api/pharmacy/requests", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('pharmacy_token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        // No need to filter since backend now returns only relevant requests
        setRequests(data);
        setLoading(false);
        // Calculate dashboard stats
        let totalRequests = data.length;
        let billsGenerated = 0, confirmed = 0, pending = 0, ignored = 0;
        data.forEach(req => {
          console.log('Initial load - Processing request:', req._id, 'Status:', req.status, 'Bills:', req.bills);
          if (req.status === 'accepted' && req.acceptedBy && req.acceptedBy.toString() === pharmacy._id.toString()) {
            confirmed++; // Customer accepted this pharmacy's bill
            console.log('Initial load - Request confirmed by this pharmacy');
          } else if (req.status === 'accepted' && req.acceptedBy && req.acceptedBy.toString() !== pharmacy._id.toString()) {
            ignored++; // Customer accepted another pharmacy's bill
            console.log('Initial load - Request ignored - accepted by another pharmacy');
          } else if (req.status === 'pending' && req.bills && req.bills.some(bill => bill.pharmacy._id.toString() === pharmacy._id.toString())) {
            billsGenerated++; // This pharmacy has generated a bill but customer hasn't accepted yet
            console.log('Initial load - Bill generated by this pharmacy');
          } else if (req.status === 'pending') {
            pending++; // Still pending, no bill generated by this pharmacy
            console.log('Initial load - Request still pending');
          } else if (req.status === 'rejected') {
            ignored++; // Request was rejected
            console.log('Initial load - Request rejected');
          }
        });
        console.log('Initial load - Dashboard stats calculated:', { totalRequests, billsGenerated, confirmed, pending, ignored });
        setDashboardStats({ totalRequests, billsGenerated, confirmed, pending, ignored });
      })
      .catch((error) => {
        console.error('Error fetching requests:', error);
        setError("Failed to load requests.");
        setLoading(false);
      });
  }, [pharmacy, authLoading]);

  // Periodic refresh to keep dashboard updated
  useEffect(() => {
    if (!pharmacy || authLoading) return;
    
    const interval = setInterval(refreshRequests, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [pharmacy, authLoading]);

  // Preserve pharmacy state during operations
  useEffect(() => {
    if (pharmacy && !localStorage.getItem('pharmacy_token')) {
      // If pharmacy exists but token is missing, try to restore from localStorage
      const storedPharmacy = localStorage.getItem('pharmacy_data');
      if (storedPharmacy) {
        try {
          const parsedPharmacy = JSON.parse(storedPharmacy);
          // Don't update state here, just ensure token exists
          if (!localStorage.getItem('pharmacy_token')) {
            console.warn('Pharmacy token missing, but pharmacy data exists');
          }
        } catch (e) {
          console.error('Failed to parse stored pharmacy data:', e);
        }
      }
    }
  }, [pharmacy]);

  // Remove the problematic authentication check useEffect

  const handleViewMedicineList = (request) => {
    console.log('Opening medicine list for request:', request);
    setSelectedRequest(request);
    setShowMedicinePopup(true);
    setIsBillGenerationMode(false); // Ensure it's not in bill generation mode
    
    // If request already has a bill generated, load bill details
    if (request.status === 'accepted' && request.bill) {
      loadBillDetailsForPopup(request.bill);
      return;
    }
  };

  const loadBillDetailsForPopup = async (billId) => {
    if (!billId) return;
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
        console.error('Failed to load bill details');
      }
    } catch (e) {
      setBillDetails(null);
      console.error('Network error while loading bill details');
    } finally {
      setLoadingBillDetails(false);
    }
  };

  const closeMedicinePopup = () => {
    setShowMedicinePopup(false);
    setSelectedRequest(null);
    setIsBillGenerationMode(false);
    setBillDetails(null); // Reset bill details when closing popup
  };

  const handleAcceptRequest = () => {
    if (!selectedRequest) return;
    
    // Prevent accepting requests that already have bills
    if (selectedRequest.status === 'accepted' && selectedRequest.bill) {
      alert('Bill has already been generated for this request.');
      return;
    }
    
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
    
    // Transform the existing popup to bill generation mode instead of opening a new one
    setIsBillGenerationMode(true);
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    
    // Prevent rejecting requests that already have bills
    if (selectedRequest.status === 'accepted' && selectedRequest.bill) {
      alert('Cannot reject a request that already has a bill generated.');
      return;
    }
    
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
        // Add a small delay before refreshing to ensure server has processed the update
        setTimeout(() => {
          refreshRequestsData(); // Refresh data to update status
        }, 1000);
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
    if (!selectedRequest) {
      alert('No request selected');
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
        
        // First, update the local state immediately to reflect the change
        setRequests(prev => {
          const updated = prev.map(req => 
            req._id === selectedRequest._id 
              ? { 
                  ...req, 
                  bills: req.bills ? [...req.bills, data.bill] : [data.bill],
                  hasGeneratedBill: true 
                }
              : req
          );
          return updated;
        });

        // Update dashboard stats immediately
        setDashboardStats(prev => ({
          ...prev,
          billsGenerated: prev.billsGenerated + 1
        }));

        // Show success message
        displaySuccessMessage('Bill generated successfully! Waiting for customer to accept.');
        
        // Clean up popup state but keep dashboard visible
        setShowMedicinePopup(false);
        setSelectedRequest(null);
        setBillData({
          medicines: [],
          deliveryCharges: 0,
          deliveryTime: ""
        });
        setIsBillGenerationMode(false);
        
        // Ensure pharmacy state is preserved
        if (pharmacy) {
          localStorage.setItem('pharmacy_data', JSON.stringify(pharmacy));
        }
        
        // Refresh data in the background without affecting UI
        setTimeout(() => {
          refreshRequestsData();
          refreshRequests();
        }, 500);
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert(errorData.message || 'Failed to generate bill');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#007bff';
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'completed': return '#6c757d';
      default: return '#007bff';
    }
  };

  // Helper function to get display status for a request
  const getDisplayStatus = (request) => {
    if (request.status === 'accepted') {
      if (request.acceptedBy && request.acceptedBy.toString() === pharmacy._id.toString()) {
        return 'Offer Accepted';
      } else {
        return 'Request Ignored';
      }
    } else if (request.status === 'pending') {
      // Check if this pharmacy has generated a bill
      if (request.bills && request.bills.some(bill => bill.pharmacy._id.toString() === pharmacy._id.toString())) {
        return 'Bill Generated';
      } else {
        return 'Pending';
      }
    } else if (request.status === 'rejected') {
      return 'Rejected';
    }
    return request.status;
  };

  // Helper function to get status color for display
  const getDisplayStatusColor = (request) => {
    if (request.status === 'accepted') {
      if (request.acceptedBy && request.acceptedBy.toString() === pharmacy._id.toString()) {
        return '#28a745'; // Green for accepted
      } else {
        return '#dc3545'; // Red for ignored
      }
    } else if (request.status === 'pending') {
      if (request.bills && request.bills.some(bill => bill.pharmacy._id.toString() === pharmacy._id.toString())) {
        return '#ffc107'; // Yellow for bill generated
      } else {
        return '#007bff'; // Blue for pending
      }
    } else if (request.status === 'rejected') {
      return '#dc3545'; // Red for rejected
    }
    return '#007bff';
  };

  return (
    <div className="pharmacy-dashboard-bg">
      <Header />
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message" style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '6px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {successMessage}
        </div>
      )}
      
      {/* Show loading state while auth is initializing */}
      {authLoading && (
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
          <p>Initializing dashboard...</p>
        </div>
      )}
      
      {/* Debug info - remove this after fixing */}
      {!authLoading && (
        <div style={{ 
          position: 'fixed', 
          top: '100px', 
          right: '20px', 
          backgroundColor: '#f8f9fa', 
          padding: '10px', 
          border: '1px solid #dee2e6', 
          borderRadius: '5px', 
          fontSize: '12px',
          zIndex: 999
        }}>
          <div>Auth Loading: {authLoading.toString()}</div>
          <div>Pharmacy: {pharmacy ? 'Yes' : 'No'}</div>
          <div>Requests: {requests.length}</div>
          <div>Loading: {loading.toString()}</div>
        </div>
      )}
      
      {/* Show dashboard when pharmacy is authenticated */}
      {!authLoading && pharmacy && (
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
                <div className="pharmacy-meta"><span>Licence:</span> {pharmacyProfile?.licence || pharmacyProfile?.licence || "-"}</div>
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
                  <span className="stat-label">Offers Accepted</span>
                  <span className="stat-value">{dashboardStats.confirmed}</span>
                </div>
                <div className="dashboard-stat-item pending">
                  <span className="stat-label">Pending</span>
                  <span className="stat-value">{dashboardStats.pending}</span>
                </div>
                <div className="dashboard-stat-item ignored">
                  <span className="stat-label">Request Ignored</span>
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
                  <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
                    <span className="filter-label">Total Requests</span>
                    <span className="filter-count">{getFilterCount('all')}</span>
                  </button>
                  <button className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`} onClick={() => setActiveFilter('pending')}>
                    <span className="filter-label">Pending</span>
                    <span className="filter-count">{getFilterCount('pending')}</span>
                  </button>
                  <button className={`filter-btn ${activeFilter === 'billGenerated' ? 'active' : ''}`} onClick={() => setActiveFilter('billGenerated')}>
                    <span className="filter-label">Bill Generated</span>
                    <span className="filter-count">{getFilterCount('billGenerated')}</span>
                  </button>
                  <button className={`filter-btn ${activeFilter === 'orderConfirmed' ? 'active' : ''}`} onClick={() => setActiveFilter('orderConfirmed')}>
                    <span className="filter-label">Order Confirmed</span>
                    <span className="filter-count">{getFilterCount('orderConfirmed')}</span>
                  </button>
                  <button className={`filter-btn ${activeFilter === 'requestIgnored' ? 'active' : ''}`} onClick={() => setActiveFilter('requestIgnored')}>
                    <span className="filter-label">Request Ignored</span>
                    <span className="filter-count">{getFilterCount('requestIgnored')}</span>
                  </button>
                </div>
              </div>

              {loading && <div className="loading-msg">Loading requests...</div>}
              {error && <div className="error-msg">{error}</div>}
              {!loading && !error && getFilteredRequests().length === 0 && (
                <div className="no-requests-message">
                  {activeFilter === 'all' ? 'No requests for your pharmacy yet.' : `No ${activeFilter.replace(/([A-Z])/g, ' $1').toLowerCase()} requests found.`}
                </div>
              )}
              {!loading && !error && getFilteredRequests().length > 0 && (
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
                          {req.status === 'pending' && (!req.bills || !req.bills.some(bill => bill.pharmacy._id.toString() === pharmacy._id.toString())) && (
                            <button className="view-medicine-btn" onClick={() => handleViewMedicineList(req)}>
                              View Medicine List
                            </button>
                          )}
                          {req.status === 'accepted' && req.bill && (
                            <button className="view-medicine-btn" onClick={() => openBillDetails(req.bill)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                              View Bill
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Right column: Basic request info */}
                      <div style={{ flex: 2 }}>
                        <div><b>Request ID:</b> {req._id}</div>
                        <div><b>Date:</b> {new Date(req.createdAt).toLocaleDateString()}</div>
                        <div><b>Total Medicines:</b> {req.medicines.length}</div>
                        <div><b>Status:</b> <span style={{ color: getDisplayStatusColor(req), fontWeight: 'bold' }}>{getDisplayStatus(req)}</span></div>
                      </div>
                      {/* Left-bottom View button when bill is generated */}
                      {req.bills && req.bills.some(bill => bill.pharmacy._id.toString() === pharmacy._id.toString()) && (
                        <button 
                          className="view-bill-btn"
                          onClick={() => {
                            const bill = req.bills.find(bill => bill.pharmacy._id.toString() === pharmacy._id.toString());
                            if (bill) openBillDetails(bill._id);
                          }}
                        >
                          View Bill
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Show loading state during bill generation */}
              {submitting && (
                <div className="loading-msg" style={{ textAlign: 'center', padding: '20px' }}>
                  Generating bill... Please wait.
                </div>
              )}
            </div>
          </main>
        </div>
      )}
      
      {/* Medicine List Popup */}
      {showMedicinePopup && selectedRequest && (
        <div className="medicine-popup-overlay" onClick={closeMedicinePopup}>
          <div className="medicine-popup" onClick={e => e.stopPropagation()}>
            <div className="medicine-popup-header">
              <h3>
                {isBillGenerationMode ? 'Generate Bill' :
                  (selectedRequest.status === 'accepted' && selectedRequest.bill ? 'Bill Details' : 'Medicine List')}
              </h3>
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
              {!isBillGenerationMode ? (
                <>
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
                    {/* Show bill details if bill exists */}
                    {selectedRequest.status === 'accepted' && selectedRequest.bill && (
                      <div className="bill-details-section">
                        <h4>Bill Summary</h4>
                        {loadingBillDetails ? (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            Loading bill details...
                          </div>
                        ) : billDetails ? (
                          <>
                            <div className="customer-details">
                              <p><strong>Delivery Time:</strong> {billDetails.deliveryTime || '-'}</p>
                              <p><strong>Delivery Charges:</strong> ₹{Number(billDetails.deliveryCharges || 0).toFixed(2)}</p>
                              <p><strong>Total Amount:</strong> ₹{Number(billDetails.totalAmount || 0).toFixed(2)}</p>
                            </div>
                            <div className="medicine-table-container">
                              <h5>Medicine Prices</h5>
                              <table className="medicine-popup-table">
                                <thead>
                                  <tr>
                                    <th>Medicine Name</th>
                                    <th>Quantity</th>
                                    <th>Price per Unit</th>
                                    <th>Total Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(billDetails.medicines || []).map((med, i) => (
                                    <tr key={i}>
                                      <td>{med.name}</td>
                                      <td>{med.quantity}</td>
                                      <td>₹{Number(med.pricePerUnit || 0).toFixed(2)}</td>
                                      <td>₹{Number(med.totalPrice || 0).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '20px', color: '#dc3545' }}>
                            Failed to load bill details
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="popup-actions">
                    <button className="action-btn accept-btn" onClick={handleAcceptRequest} disabled={submitting}>Accept Request</button>
                    <button className="action-btn reject-btn" onClick={handleRejectRequest} disabled={submitting}>Reject Request</button>
                    <button className="action-btn close-btn" onClick={closeMedicinePopup}>Close</button>
                  </div>
                </>
              ) : (
                <>
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
                                  onChange={e => handlePriceChange(i, e.target.value)}
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
                            onChange={e => setBillData({ ...billData, deliveryCharges: parseFloat(e.target.value) || 0 })}
                            className="delivery-input"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="input-group">
                          <label>Delivery Time:</label>
                          <input
                            type="text"
                            value={billData.deliveryTime}
                            onChange={e => setBillData({ ...billData, deliveryTime: e.target.value })}
                            className="delivery-input"
                            placeholder="e.g., 2-3 hours, Same day"
                          />
                        </div>
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
                    <button className="action-btn accept-btn" onClick={handleSubmitBill} disabled={submitting}>
                      {submitting ? 'Generating Bill...' : 'Generate Bill'}
                    </button>
                    <button className="action-btn close-btn" onClick={closeMedicinePopup}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bill Details Popup */}
      {showBillDetailsPopup && (
        <div className="medicine-popup-overlay" onClick={closeBillDetails}>
          <div className="medicine-popup" onClick={e => e.stopPropagation()}>
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
      
      {/* Fallback: Always show dashboard if we have requests data, even if pharmacy state is unclear */}
      {!authLoading && !pharmacy && requests.length > 0 && (
        <div className="pharmacy-dashboard-container">
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
            <p>Dashboard data available. If you're experiencing issues, please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard; 