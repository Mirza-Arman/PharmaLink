import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);

  useEffect(() => {
    const customerToken = localStorage.getItem("customer_token");
    const pharmacyToken = localStorage.getItem("pharmacy_token");
    const customerUser = localStorage.getItem("customer_user");
    const pharmacyUser = localStorage.getItem("pharmacy_user");
    if (customerToken && customerUser) setCustomer(JSON.parse(customerUser));
    if (pharmacyToken && pharmacyUser) setPharmacy(JSON.parse(pharmacyUser));
  }, []);

  const loginCustomer = (user, token) => {
    // Clear pharmacy session if exists (mutual exclusion)
    if (pharmacy) {
      localStorage.removeItem("pharmacy_token");
      localStorage.removeItem("pharmacy_user");
      setPharmacy(null);
    }
    localStorage.setItem("customer_token", token);
    localStorage.setItem("customer_user", JSON.stringify(user));
    setCustomer(user);
  };
  const loginPharmacy = (user, token) => {
    // Clear customer session if exists (mutual exclusion)
    if (customer) {
      localStorage.removeItem("customer_token");
      localStorage.removeItem("customer_user");
      setCustomer(null);
    }
    localStorage.setItem("pharmacy_token", token);
    localStorage.setItem("pharmacy_user", JSON.stringify(user));
    setPharmacy(user);
  };
  const logout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    localStorage.removeItem("pharmacy_token");
    localStorage.removeItem("pharmacy_user");
    setCustomer(null);
    setPharmacy(null);
  };

  return (
    <AuthContext.Provider value={{ customer, pharmacy, loginCustomer, loginPharmacy, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 