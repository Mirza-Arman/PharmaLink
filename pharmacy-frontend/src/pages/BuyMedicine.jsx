
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../component/Header";
import "./BuyMedicine.css";

const initialMedicine = { 
  name: "", 
  type: "", 
  strength: "", 
  quantity: 1 
};

const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Sialkot"];

const medicineTypes = ["Tablet", "Capsule", "Syrup", "Injection", "Cream/Ointment", "Drop"];

// Sample medicine names for autosuggest (in a real app, this would come from an API)
const medicineSuggestions = [
  "Paracetamol", "Augmentin", "Amoxicillin", "Ibuprofen", "Omeprazole", 
  "Cetirizine", "Loratadine", "Metformin", "Amlodipine", "Atorvastatin",
  "Aspirin", "Vitamin D", "Calcium", "Iron", "Folic Acid"
];

const BuyMedicine = () => {
  const [medicines, setMedicines] = useState([{ ...initialMedicine }]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setTimeout(() => setFormVisible(true), 100);
  }, []);

  const handleMedicineChange = (idx, field, value) => {
    const updated = medicines.map((med, i) =>
      i === idx ? { ...med, [field]: value } : med
    );
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { ...initialMedicine }]);
  };

  const removeMedicine = (idx) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleMedicineNameChange = (idx, value) => {
    handleMedicineChange(idx, "name", value);
    
    if (value.length > 1) {
      const filtered = medicineSuggestions.filter(med => 
        med.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion, idx) => {
    handleMedicineChange(idx, "name", suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="buy-medicine-bg">
      <Header />
      <div className="buy-medicine-container">
        <div className={`buy-medicine-inner ${formVisible ? "form-visible" : ""}`}>
          <h2 className="buy-medicine-title">Buy Medicines</h2>
          <form className="buy-medicine-form" autoComplete="off">
            <div className="two-column-layout">
              {/* Left Column - Medicine Selection */}
              <div className="left-column">
                <div className="form-section">
                  <label className="form-label">Medicines List</label>
                  {medicines.map((med, idx) => (
                    <div className="medicine-card" key={idx} style={{animationDelay: `${idx * 0.05}s`}}>
                      <div className="medicine-row">
                        <div className="medicine-name-container">
                          <input
                            className="medicine-input"
                            type="text"
                            placeholder="Medicine Name"
                            value={med.name}
                            onChange={e => handleMedicineNameChange(idx, e.target.value)}
                            onFocus={() => med.name.length > 1 && setShowSuggestions(true)}
                            required
                          />
                          {showSuggestions && suggestions.length > 0 && (
                            <div className="suggestions-dropdown">
                              {suggestions.map((suggestion, suggestionIdx) => (
                                <div
                                  key={suggestionIdx}
                                  className="suggestion-item"
                                  onClick={() => selectSuggestion(suggestion, idx)}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="medicine-details">
                        <div className="medicine-field">
                          <label className="field-label">Type</label>
                          <select
                            className="medicine-select"
                            value={med.type}
                            onChange={e => handleMedicineChange(idx, "type", e.target.value)}
                          >
                            <option value="">Select Type</option>
                            {medicineTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="medicine-field">
                          <label className="field-label">Strength/Dosage</label>
                          <input
                            className="medicine-input-small"
                            type="text"
                            placeholder="e.g., 500mg, 5ml"
                            value={med.strength}
                            onChange={e => handleMedicineChange(idx, "strength", e.target.value)}
                          />
                        </div>
                        
                        <div className="medicine-field">
                          <label className="field-label">Quantity</label>
                          <input
                            className="medicine-qty"
                            type="number"
                            min="1"
                            value={med.quantity}
                            onChange={e => handleMedicineChange(idx, "quantity", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="medicine-actions">
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeMedicine(idx)}
                          disabled={medicines.length === 1}
                          title="Remove"
                        >
                          &minus;
                        </button>
                        {idx === medicines.length - 1 && (
                          <button
                            type="button"
                            className="add-btn"
                            onClick={addMedicine}
                            title="Add Medicine"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Customer Information */}
              <div className="right-column">
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

                <div className="form-section">
                  <label className="form-label" htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    className="form-input address-textarea"
                    placeholder="Delivery Address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-section">
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    className="form-input"
                    type="tel"
                    placeholder="03XXXXXXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    pattern="03[0-9]{9}"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              className="submit-btn"
              type="button"
              onClick={() => {
                // Pass form data to select pharmacy page
                navigate("/select-pharmacy", {
                  state: {
                    medicines,
                    address,
                    phone,
                    city
                  }
                });
              }}
            >
              Select Pharmacy
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyMedicine; 