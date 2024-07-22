import React from 'react';
import { GoogleLogout } from 'react-google-login';

const GoogleLogoutButton = ({ onLogoutSuccess }) => {
  return (
    <GoogleLogout
      clientId='571441638341-45rnsf56sp2qa2tr5tbdd31m9b3jin7n.apps.googleusercontent.com'
      onLogoutSuccess={onLogoutSuccess}
      render={renderProps => (
        <button 
          onClick={renderProps.onClick} 
          disabled={renderProps.disabled} 
          className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'
        >
          Logout
        </button>
      )}
    />
  );
}

export default GoogleLogoutButton;
