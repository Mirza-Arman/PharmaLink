
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
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
  const [medicines, setMedicines] = useState([]);
  const [currentMedicine, setCurrentMedicine] = useState({ ...initialMedicine });
  const [nameError, setNameError] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { customer } = useAuth();
  const [submitErrors, setSubmitErrors] = useState([]);

  React.useEffect(() => {
    setTimeout(() => setFormVisible(true), 100);
    if (customer && customer.name) setCustomerName(customer.name);
  }, [customer]);

  const handleCurrentMedicineChange = (field, value) => {
    if (field === "name" && nameError) {
      setNameError(false);
    }
    setCurrentMedicine(prev => ({ ...prev, [field]: value }));
  };

  const addMedicine = () => {
    if (!currentMedicine.name || !currentMedicine.name.trim()) {
      setNameError(true);
      return;
    }
    setMedicines(prev => [...prev, { ...currentMedicine }]);
    setCurrentMedicine({ ...initialMedicine });
    setShowSuggestions(false);
  };

  const removeMedicine = (indexToRemove) => {
    setMedicines(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleMedicineNameChange = (value) => {
    handleCurrentMedicineChange("name", value);
    
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

  const selectSuggestion = (suggestion) => {
    handleCurrentMedicineChange("name", suggestion);
    setShowSuggestions(false);
  };

  const getSubmitErrors = () => {
    const errors = [];
    if (medicines.length === 0) errors.push("Please add at least one medicine.");
    if (!city) errors.push("Please select a city.");
    if (!address.trim()) errors.push("Please enter your address.");
    if (!/^03[0-9]{9}$/.test(phone)) errors.push("Please enter a valid phone number (03XXXXXXXXX).");
    return errors;
  };

  React.useEffect(() => {
    if (submitErrors.length > 0) {
      setSubmitErrors(getSubmitErrors());
    }
  }, [medicines, city, address, phone]);

  const isSubmitDisabled =
    medicines.length === 0 ||
    !city ||
    !address.trim() ||
    !/^03[0-9]{9}$/.test(phone);

  return (
    <div className="buy-medicine-bg">
      <Header />
      <div className="buy-medicine-container">
        <div className={`buy-medicine-inner ${formVisible ? "form-visible" : ""}`}>
          <h2 className="buy-medicine-title">Order Medicines</h2>
          <form className="buy-medicine-form" autoComplete="off">
            <div className="two-column-layout">
              {/* Left Column - Medicine Selection */}
              <div className="left-column">
                <div className="form-section">
                  <label className="form-label">Medicines List</label>
                  <div className="medicine-card">
                      <div className="medicine-row">
                        <div className="medicine-name-container">
                          <input
                          className={`medicine-input${nameError ? " input-error" : ""}`}
                            type="text"
                            placeholder="Medicine Name"
                          value={currentMedicine.name}
                          onChange={e => handleMedicineNameChange(e.target.value)}
                          onFocus={() => currentMedicine.name.length > 1 && setShowSuggestions(true)}
                            required
                          />
                        {nameError && (
                          <div className="error-text">Add medicine</div>
                        )}
                          {showSuggestions && suggestions.length > 0 && (
                            <div className="suggestions-dropdown">
                              {suggestions.map((suggestion, suggestionIdx) => (
                                <div
                                  key={suggestionIdx}
                                  className="suggestion-item"
                                onClick={() => selectSuggestion(suggestion)}
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
                          value={currentMedicine.type}
                          onChange={e => handleCurrentMedicineChange("type", e.target.value)}
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
                          value={currentMedicine.strength}
                          onChange={e => handleCurrentMedicineChange("strength", e.target.value)}
                          />
                        </div>
                        <div className="medicine-field medicine-qty-actions">
                          <label className="field-label">Quantity</label>
                            <input
                              className="medicine-qty"
                              type="number"
                              min="1"
                          value={currentMedicine.quantity}
                          onChange={e => handleCurrentMedicineChange("quantity", e.target.value)}
                              required
                            />
                      </div>
                      <div className="medicine-actions">
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeMedicine(medicines.length - 1)}
                          disabled={medicines.length === 0}
                          title="Remove last medicine"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          className="add-btn"
                          onClick={addMedicine}
                          title="Add Medicine"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {medicines.length > 0 && (
                      <div className="added-medicine-list">
                        <div className="added-medicine-header">
                          <span>Medicine</span>
                          <span>Type</span>
                          <span>Strength</span>
                          <span>Qty</span>
                          <span>Action</span>
                        </div>
                        <ul>
                          {medicines.map((m, i) => (
                            <li key={`${m.name}-${i}`} className="added-medicine-item">
                              <span className="added-medicine-name">{m.name || "Unnamed"}</span>
                              <span className="added-medicine-meta">{m.type || "-"}</span>
                              <span className="added-medicine-meta">{m.strength || "-"}</span>
                              <span className="added-medicine-qty">x{m.quantity}</span>
                              <button
                                type="button"
                                className="remove-btn"
                                title="Remove this medicine"
                                onClick={() => removeMedicine(i)}
                              >
                                -
                                </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                              )}
                            </div>
                </div>
              </div>

              {/* Right Column - Customer Information */}
              <div className="right-column">
                <div className="form-section">
                  <label className="form-label" htmlFor="customerName">Customer Name</label>
                  <input
                    id="customerName"
                    className="form-input"
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    required
                    disabled={!!(customer && customer.name)}
                  />
                </div>
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

            {submitErrors.length > 0 && (
              <div className="submit-error">
                <ul>
                  {submitErrors.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="submit-btn"
              type="button"
              onClick={() => {
                const errors = getSubmitErrors();
                if (errors.length > 0) {
                  setSubmitErrors(errors);
                  return;
                }
                setSubmitErrors([]);
                const orderState = { medicines, address, phone, city, customerName };
                if (!customer) {
                  navigate("/customer-auth", {
                    state: { redirectTo: "/select-pharmacy", pendingOrder: orderState }
                  });
                  return;
                }
                navigate("/select-pharmacy", { state: orderState });
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