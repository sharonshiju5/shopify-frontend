import React from 'react';
import './css/loader.css';

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className={`loader ${size}`}>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;