import React from 'react';
import Loader from './Loader';
import './css/product-loader.css';

// Full page overlay loader
export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="loader-overlay">
    <Loader size="large" text={text} />
  </div>
);

// Inline loader for buttons
export const ButtonLoader = ({ text = 'Processing...' }) => (
  <div className="loader-inline">
    <Loader size="small" text={text} />
  </div>
);

// Product card loader
export const ProductLoader = () => (
  <div className="product-loader">
    <div className="product-loader-image"></div>
    <div className="product-loader-content">
      <div className="product-loader-line"></div>
      <div className="product-loader-line short"></div>
      <div className="product-loader-price"></div>
    </div> 
  </div>
);

export default { PageLoader, ButtonLoader, ProductLoader };