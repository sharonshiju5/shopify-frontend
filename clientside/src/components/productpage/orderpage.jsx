import axios from 'axios';
import React, { useEffect, useState } from 'react';
import APIURL from '../path';
import { motion } from 'framer-motion';
import Navbar from "../productpage/nav";
import LoginPrompt from './LoginPrompt';
import Footer from './footer';
import {  Link,useNavigate } from "react-router-dom";

const OrderedProducts = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const userId = localStorage.getItem("userId");

  async function fetchOrderDetails() {
    try {
      const res = await axios.post(APIURL + "/orders", { userId });
      if (res.status === 200) {
        const { prod } = res.data;
        setOrders(prod);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
    } 
  }

  useEffect(() => {
    if (userId) {
      fetchOrderDetails();
    }
  }, [userId]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  
  
  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-red-100 border-l-8 border-red-500 p-6 my-8 rounded-lg shadow-md max-w-4xl mx-auto"
    >
      <p className="text-red-700 font-medium text-lg">{error}</p>
      <button 
        onClick={() => fetchOrderDetails()}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors duration-300 shadow-sm"
      >
        Try Again
      </button>
    </motion.div>
  );

  return (
    <>
    <div className='z-50'>
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-50 min-h-screen -mt-8 py-8"
      >    
    
      <Navbar/>
      {userId?(
      <div className="container mx-auto  p-4 max-w-5xl">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Orders</h2>
        
        {orders.length === 0 ? (
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-white p-12 text-center rounded-xl shadow-md border border-gray-200"
          >
            <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <Link to={"/"}>
              <p className="text-gray-600 text-xl mb-6">You haven't placed any orders yet</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition-colors duration-300 shadow-md text-lg font-medium">
              Start Shopping
            </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6 overflow-auto h-120">
            {orders.map((order, index) => (
              <motion.div 
                key={order._id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
              >
                <motion.div 
                  className={`p-5 cursor-pointer flex justify-between items-center transition-colors duration-300 ${expandedOrder === order._id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleOrderExpansion(order._id)}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${expandedOrder === order._id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-500">Placed on {formatDate(order.orderDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    {/* <div className="text-right hidden md:block">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-semibold text-gray-800">${order.totalAmount || '0.00'}</p>
                    </div> */}
                    <motion.div 
                      animate={{ 
                        rotate: expandedOrder === order._id ? 180 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>

                {expandedOrder === order._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: 1, 
                      height: "auto",
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.25, delay: 0.15 }
                      }
                    }}
                    exit={{ 
                      opacity: 0,
                      height: 0,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.15 }
                      }
                    }}
                    className="border-t border-gray-100 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-gray-50">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center mb-3">
                          <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p className="font-medium text-gray-700 text-sm">Customer</p>
                        </div>
                        <p className="text-sm text-gray-800">{order.name}</p>
                        <p className="text-sm text-gray-800">{order.email}</p>
                        <p className="text-sm text-gray-800">{order.phone}</p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center mb-3">
                          <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="font-medium text-gray-700 text-sm">Shipping Address</p>
                        </div>
                        <p className="text-sm text-gray-800">{order.address.name}</p>
                        <p className="text-sm text-gray-800">{order.address.street}, {order.address.city}</p>
                        <p className="text-sm text-gray-800">{order.address.state}, {order.address.pincode}</p>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center mb-3">
                          <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="font-medium text-gray-700 text-sm">Delivery</p>
                        </div>
                        <p className="text-sm text-gray-500">Expected:</p>
                        <p className="text-sm font-medium text-indigo-600">{formatDate(order.estimateDate)}</p>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center mb-4">
                        <h4 className="text-base font-medium text-gray-800">Order Items</h4>
                        <div className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                          {order.products.length}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.products.map((product, prodIndex) => (
                          <motion.div
                            key={product._id}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: prodIndex * 0.05 }}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
                          >
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                              {product.images && product.images[0] ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                              {product.offer && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded shadow-sm">
                                  {product.offer}% OFF
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h5 className="font-medium text-gray-800 mb-1 line-clamp-1">{product.name}</h5>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {product.brand && (
                                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">{product.brand}</span>
                                )}
                                {product.category && (
                                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">{product.category}</span>
                                )}
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-lg font-medium text-indigo-600">${product.price}</p>
                                {product.offer && (
                                  <p className="text-xs line-through text-gray-400">
                                    ${Math.round(product.price * (100 / (100 - product.offer)))}
                                  </p>
                                )}
                              </div>
                              {product.sizes && product.sizes.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="flex flex-wrap gap-1">
                                    {product.sizes.map(size => (
                                      <span key={size} className="px-2 py-1 text-xs bg-gray-50 border border-gray-200 rounded">{size}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      ):(
        <div className='mt-10'>
          <LoginPrompt/>
        </div>
      )}
    </motion.div>
    <div>
      <Footer/>
    </div>
    </>
  );
};

export default OrderedProducts;