import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const params = new URLSearchParams(window.location.search);
const redirect = params.get("redirect");

if (redirect) {
  window.history.replaceState(null, null, redirect);
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);