import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BuyMedicine.css";
import { useAuth } from "../AuthContext";

const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Sialkot"];

const SelectPharmacy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer } = useAuth();
  const [city, setCity] = useState(location.state?.city || "");
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPharmacies, setSelectedPharmacies] = useState([]);

  useEffect(() => {
    if (city) {
      setLoading(true);
      fetch(`http://localhost:5000/api/pharmacy/pharmacies?city=${encodeURIComponent(city)}`)
        .then(res => res.json())
        .then(data => {
          setPharmacies(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load pharmacies");
          setLoading(false);
        });
    } else {
      setPharmacies([]);
    }
  }, [city]);

  return (
    <div className="buy-medicine-bg">
      <div className="buy-medicine-container">
        <div className="buy-medicine-inner form-visible">
          <h1 style={{ textAlign: 'center', fontWeight: 900, fontSize: 32, color: '#2ca7a0', marginBottom: 32 }}>Select a Pharmacy</h1>
          <div className="form-section">
            <label className="form-label" htmlFor="city">City</label>
            <select
              id="city"
              className="form-input"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
            >
              <option value="">Select City</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {loading && <div>Loading pharmacies...</div>}
          {error && <div className="error-msg">{error}</div>}
          {!loading && !error && city && pharmacies.length === 0 && (
            <div>No pharmacies found in this city.</div>
          )}
          {!loading && pharmacies.length > 0 && (
            <div className="form-section">
              <label className="form-label">Available Pharmacies</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {pharmacies.map(pharmacy => {
                  const isSelected = selectedPharmacies.includes(pharmacy._id);
                  return (
                    <div
                      key={pharmacy._id}
                      className="pharmacy-select-card"
                      style={{
                        position: 'relative',
                        background: isSelected ? '#eaf7f6' : '#fff',
                        border: '1.5px solid #2ca7a0',
                        borderRadius: 10,
                        padding: '18px 28px',
                        boxShadow: isSelected ? '0 2px 12px #b2f0e6' : 'none',
                        transition: 'all 0.18s cubic-bezier(.4,1.4,.6,1)',
                        minHeight: 110
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 20, color: '#2ca7a0', marginBottom: 2 }}>{pharmacy.pharmacyName}</div>
                        <div style={{ fontSize: 15, color: '#333' }}><b>Address:</b> {pharmacy.address}</div>
                        <div style={{ fontSize: 15, color: '#333' }}><b>Phone Number:</b> {pharmacy.phone || 'N/A'}</div>
                        <div style={{ fontSize: 15, color: '#333' }}><b>Email:</b> {pharmacy.email || 'N/A'}</div>
                      </div>
                      <button
                        className="select-toggle-btn"
                        style={{
                          position: 'absolute',
                          bottom: '18px',
                          right: '28px',
                          background: isSelected ? '#888' : '#2ca7a0',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 20px',
                          fontWeight: 700,
                          fontSize: 14,
                          height: 36,
                          width: 100,
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          boxShadow: '0 2px 8px rgba(44,167,160,0.08)'
                        }}
                        onClick={() => {
                          setSelectedPharmacies(prev =>
                            isSelected
                              ? prev.filter(id => id !== pharmacy._id)
                              : [...prev, pharmacy._id]
                          );
                        }}
                      >
                        {isSelected ? 'Remove' : 'Select'}
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                className="submit-btn"
                style={{ marginTop: 24 }}
                disabled={selectedPharmacies.length === 0}
                onClick={async () => {
                  // Send request to backend
                  const reqBody = {
                    medicines: location.state?.medicines || [],
                    address: location.state?.address || "",
                    phone: location.state?.phone || "",
                    city: city,
                    selectedPharmacies,
                    // Keep names in the exact same order as selectedPharmacies to match indices on the server/UI
                    pharmacyNames: selectedPharmacies.map(id => {
                      const p = pharmacies.find(ph => ph._id === id);
                      return p ? p.pharmacyName : 'Pharmacy';
                    }),
                    customer: customer?._id || null,
                    customerName: location.state?.customerName || customer?.email || ""
                  };
                  
                  console.log('Sending request with data:', reqBody);
                  
                  try {
                    const headers = { "Content-Type": "application/json" };
                    const token = localStorage.getItem("customer_token");
                    if (token) headers.Authorization = `Bearer ${token}`;
                    const res = await fetch("http://localhost:5000/api/customer/request", {
                      method: "POST",
                      headers,
                      body: JSON.stringify(reqBody)
                    });
                    
                    if (res.ok) {
                      const responseData = await res.json();
                      console.log('Request successful:', responseData);
                      alert("Request submitted successfully!");
                      navigate("/");
                    } else {
                      const errorData = await res.json().catch(() => ({}));
                      console.error('Request failed:', errorData);
                      alert("Failed to submit request: " + (errorData.message || 'Unknown error'));
                    }
                  } catch (error) {
                    console.error('Network error:', error);
                    alert("Failed to submit request: Network error");
                  }
                }}
              >
                Proceed with Selected Pharmacies
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectPharmacy; 