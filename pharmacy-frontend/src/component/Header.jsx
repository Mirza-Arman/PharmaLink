import { Link } from "react-router-dom";
const Header = () => {
  const { customer, pharmacy, logout } = useAuth();
  return (
    <header className="header">
      <div className="logo-area">PharmacyConnect</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <a href="#how-it-works">How It Works</a>
        <a href="#features">Features</a>
        <a href="#faq">FAQs</a>
        <a href="#contact">Contact</a>
        {!customer && !pharmacy && <>
          <Link to="/customer-auth">Customer Login/Signup</Link>
          <Link to="/pharmacy-auth">Pharmacy Login/Signup</Link>
        </>}
        {customer && (
          <>
            <span className="user-info">{customer.email}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        )}
        {pharmacy && (
          <>
            <span className="user-info">{pharmacy.pharmacyName || pharmacy.email}</span>
            <Link to="/pharmacy-dashboard">Dashboard</Link>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};
export default Header;