import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Linkly</div>
      {user && (
        <div className="navbar-user">
          <div 
            className="user-profile"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="user-avatar" />
            ) : (
              <div className="user-avatar-placeholder">
                {user.name.charAt(0)}
              </div>
            )}
            <span className="user-name">{user.name}</span>
          </div>
          {showDropdown && (
            <div className="user-dropdown">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
