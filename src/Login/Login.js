import React, { useState } from 'react';
import './Login.css';
import PropTypes from 'prop-types';

async function loginUser(credentials) {
    return fetch('http://localhost:50924/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }
export default function Login({ setToken }) {  
    const [Username, setUserName] = useState();
    const [Password, setPassword] = useState();
    const [grant_type, setGrant_Type] = useState();
    const custom = 'web'
    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            Username,
            Password,
            grant_type,
            custom
        });
        setToken(token);
      }
  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}> 
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)}/>
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value) && setGrant_Type(e.target.value)}/>
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}
Login.propTypes = {
    setToken: PropTypes.func.isRequired
  };