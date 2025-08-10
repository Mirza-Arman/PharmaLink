import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../component/Header";
import "./BuyMedicine.css";

const initialMedicine = { name: "", quantity: 1 };
const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Sialkot"];



const BuyMedicine = () => {
  const [medicines, setMedicines] = useState([{ ...initialMedicine }]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [formVisible, setFormVisible] = useState(false);
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

  return (
    <div className="buy-medicine-bg">
      <Header />
      <div className="buy-medicine-container">
        <div className={`buy-medicine-inner ${formVisible ? "form-visible" : ""}`}>
          <h2 className="buy-medicine-title">Buy Medicines</h2>
          <form className="buy-medicine-form" autoComplete="off">
            <div className="form-section">
              <label className="form-label">Medicines List</label>
              {medicines.map((med, idx) => (
                <div className="medicine-row" key={idx} style={{animationDelay: `${idx * 0.05}s`}}>
                  <input
                    className="medicine-input"
                    type="text"
                    placeholder="Medicine Name"
                    value={med.name}
                    onChange={e => handleMedicineChange(idx, "name", e.target.value)}
                    required
                  />
                  <input
                    className="medicine-qty"
                    type="number"
                    min="1"
                    value={med.quantity}
                    onChange={e => handleMedicineChange(idx, "quantity", e.target.value)}
                    required
                  />
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
              ))}
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
              <input
                id="address"
                className="form-input"
                type="text"
                placeholder="Delivery Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
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