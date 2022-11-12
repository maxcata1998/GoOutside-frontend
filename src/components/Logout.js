import React from 'react';
// import { GoogleLogout } from 'react-google-login';
import { googleLogout } from '@react-oauth/google';
import { Button } from 'react-bootstrap';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_TD;

function Logout({ setUser }) {
  const onSuccess = () => {
    googleLogout();  // helper for logging out
    setUser(null);
    localStorage.setItem("login", null);  // clearing local storage
    console.log('Logout made successfully');
  };
  return (
    <div>
      <Button variant="danger" onClick={onSuccess}>Logout</Button>
    </div>
  );
}

export default Logout;