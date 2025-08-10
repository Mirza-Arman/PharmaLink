import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BuyMedicine from "./pages/BuyMedicine";
import CustomerAuth from "./pages/CustomerAuth";
import PharmacyAuth from "./pages/PharmacyAuth";
import SelectPharmacy from "./pages/SelectPharmacy";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import { AuthProvider } from "./AuthContext";
import UserRequests from "./pages/UserRequests";
import Footer from "./component/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buy-medicine" element={<BuyMedicine />} />
          <Route path="/customer-auth" element={<CustomerAuth />} />
          <Route path="/pharmacy-auth" element={<PharmacyAuth />} />
          <Route path="/select-pharmacy" element={<SelectPharmacy />} />
          <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
          <Route path="/user-requests" element={<UserRequests />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
