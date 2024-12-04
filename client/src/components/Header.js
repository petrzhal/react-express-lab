import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { jwtDecode as decodeJwt } from 'jwt-decode';
import './Header.css';

const Header = () => {
  const [userName, setUserName] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [timeZone, setTimeZone] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decodedToken = decodeJwt(token);
        setUserName(decodedToken.name);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('jwt');
      }
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'GET',
      });

      if (response.ok) {
        localStorage.removeItem('jwt');
        document.cookie.split(';').forEach((cookie) => {
          document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, `=; expires=${new Date(0).toUTCString()}; path=/`);
        });
        window.location.href = '/login';
      } else {
        console.error('Failed to log out:', response.statusText);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="date-timezone">
          <p className="current-date">{currentDate}</p>
          <p className="current-timezone">{timeZone}</p>
        </div>
        <h1>Museum</h1>
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/exhibitions">Exhibitions</Link></li>
          <li><Link to="/exhibits">Exhibits</Link></li>
          <li><Link to="/halls">Halls</Link></li>
        </ul>
        <ul className="auth-links nav-links">
          {userName ? (
            <>
              <li className="profile-link">
                <Link to="/profile">{userName}</Link>
              </li>
              <li>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default observer(Header);
