import React from 'react';
import { googleLogout } from '@react-oauth/google';

const GoogleLogoutButton = ({ onLogoutSuccess }) => {
  const handleLogout = () => {
    googleLogout();  // This will revoke the token and log out the user
    onLogoutSuccess();
  };

  return (
    <button 
      onClick={handleLogout} 
      className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'
    >
      Logout
    </button>
  );
}

export default GoogleLogoutButton;
