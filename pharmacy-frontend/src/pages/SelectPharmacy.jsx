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
          <h2 className="buy-medicine-title">Select Pharmacy</h2>
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
              <div className="pharmacy-grid">
                {pharmacies.map(pharmacy => (
                  <div
                    key={pharmacy._id}
                    className="pharmacy-card"
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedPharmacies.includes(pharmacy._id)}
                        onChange={e => {
                          setSelectedPharmacies(prev =>
                            e.target.checked
                              ? [...prev, pharmacy._id]
                              : prev.filter(id => id !== pharmacy._id)
                          );
                        }}
                      />
                      <span><b>{pharmacy.pharmacyName}</b></span>
                    </label>
                    <div>{pharmacy.address}</div>
                    <div>{pharmacy.email}</div>
                  </div>
                ))}
              </div>
              <button
                className="submit-btn"
                style={{ marginTop: 16 }}
                disabled={selectedPharmacies.length === 0}
                onClick={async () => {
                  // Send request to backend
                  const reqBody = {
                    medicines: location.state?.medicines || [],
                    address: location.state?.address || "",
                    phone: location.state?.phone || "",
                    city: city,
                    selectedPharmacies,
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